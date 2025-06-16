/**
 * Utility functions to handle iframe-related errors and browser extension conflicts
 */

export class IframeErrorHandler {
  private static instance: IframeErrorHandler;
  private errorFilters: ((error: Error | ErrorEvent) => boolean)[];
  private retryAttempts: Map<string, number> = new Map();
  private maxRetries = 3;

  private constructor() {
    this.errorFilters = [
      // Browser extension errors
      (error) => {
        const message = error instanceof Error ? error.message : error.message;
        return message?.includes("chrome-extension") || false;
      },
      // Ad blocker errors
      (error) => {
        const message = error instanceof Error ? error.message : error.message;
        return (
          message?.includes("net::ERR_BLOCKED_BY_CLIENT") ||
          message?.includes("uBlock") ||
          message?.includes("AdBlock") ||
          false
        );
      },
      // Iframe evaluation errors
      (error) => {
        const message = error instanceof Error ? error.message : error.message;
        return (
          message?.includes("Could not evaluate in iframe") ||
          message?.includes("iframe, doesnt exist") ||
          false
        );
      },
      // Sentry/tracking errors
      (error) => {
        const message = error instanceof Error ? error.message : error.message;
        return (
          message?.includes("sentry.io") ||
          message?.includes("analytics") ||
          message?.includes("tracking") ||
          false
        );
      },
    ];

    this.setupGlobalErrorHandlers();
  }

  public static getInstance(): IframeErrorHandler {
    if (!IframeErrorHandler.instance) {
      IframeErrorHandler.instance = new IframeErrorHandler();
    }
    return IframeErrorHandler.instance;
  }

  private setupGlobalErrorHandlers(): void {
    // Handle unhandled promise rejections
    if (typeof window !== "undefined") {
      window.addEventListener("unhandledrejection", (event) => {
        if (this.shouldFilterError(event.reason)) {
          event.preventDefault();
          console.debug(
            "Filtered out browser extension/ad blocker error:",
            event.reason,
          );
        }
      });

      // Handle general errors
      window.addEventListener("error", (event) => {
        if (this.shouldFilterError(event.error || event)) {
          event.preventDefault();
          console.debug(
            "Filtered out browser extension/ad blocker error:",
            event.error,
          );
        }
      });

      // Handle resource loading errors
      window.addEventListener(
        "error",
        (event) => {
          if (event.target && event.target !== window) {
            const element = event.target as HTMLElement;
            if (element.tagName === "SCRIPT" || element.tagName === "LINK") {
              const src =
                (element as HTMLScriptElement).src ||
                (element as HTMLLinkElement).href;
              if (this.isBlockedResource(src)) {
                event.preventDefault();
                console.debug("Filtered out blocked resource error:", src);
              }
            }
          }
        },
        true,
      );
    }
  }

  private shouldFilterError(error: any): boolean {
    if (!error) return false;

    return this.errorFilters.some((filter) => {
      try {
        return filter(error);
      } catch {
        return false;
      }
    });
  }

  private isBlockedResource(url: string): boolean {
    const blockedDomains = [
      "sentry.io",
      "google-analytics.com",
      "googletagmanager.com",
      "facebook.com",
      "connect.facebook.net",
      "doubleclick.net",
    ];

    return blockedDomains.some((domain) => url.includes(domain));
  }

  public handleIframeError(
    iframe: HTMLIFrameElement,
    callback?: () => void,
  ): void {
    const src = iframe.src;
    const retryKey = `iframe-${src}`;
    const currentRetries = this.retryAttempts.get(retryKey) || 0;

    if (currentRetries >= this.maxRetries) {
      console.warn(`Max retries reached for iframe: ${src}`);
      return;
    }

    // Add error listener
    iframe.addEventListener("error", (event) => {
      console.debug("Iframe error detected:", event);

      if (currentRetries < this.maxRetries) {
        this.retryAttempts.set(retryKey, currentRetries + 1);

        setTimeout(
          () => {
            console.debug(
              `Retrying iframe load (${currentRetries + 1}/${this.maxRetries}):`,
              src,
            );
            iframe.src = src;
            callback?.();
          },
          1000 * Math.pow(2, currentRetries),
        ); // Exponential backoff
      }
    });

    // Add load listener to reset retry count on success
    iframe.addEventListener("load", () => {
      this.retryAttempts.delete(retryKey);
    });
  }

  public wrapAsyncFunction<T extends any[], R>(
    fn: (...args: T) => Promise<R>,
    context?: string,
  ): (...args: T) => Promise<R> {
    return async (...args: T): Promise<R> => {
      try {
        return await fn(...args);
      } catch (error) {
        if (this.shouldFilterError(error)) {
          console.debug(
            `Filtered error in ${context || "async function"}:`,
            error,
          );
          throw new Error(
            "Request was blocked by browser extension or ad blocker",
          );
        }
        throw error;
      }
    };
  }

  public createSafeIframe(
    src: string,
    container: HTMLElement,
    options?: {
      className?: string;
      title?: string;
      allowFullscreen?: boolean;
      sandbox?: string;
    },
  ): HTMLIFrameElement {
    const iframe = document.createElement("iframe");

    iframe.src = src;
    iframe.className = options?.className || "w-full h-full border-0";
    iframe.title = options?.title || "Embedded content";
    iframe.loading = "lazy";

    if (options?.allowFullscreen) {
      iframe.allowFullscreen = true;
    }

    if (options?.sandbox) {
      iframe.sandbox.value = options.sandbox;
    } else {
      // Safe defaults
      iframe.sandbox.value =
        "allow-scripts allow-same-origin allow-popups allow-forms";
    }

    // Add error handling
    this.handleIframeError(iframe);

    container.appendChild(iframe);

    return iframe;
  }

  public addErrorFilter(filter: (error: Error | ErrorEvent) => boolean): void {
    this.errorFilters.push(filter);
  }

  public removeAllFilters(): void {
    this.errorFilters = [];
  }
}

// Initialize the singleton when the module loads
export const iframeErrorHandler = IframeErrorHandler.getInstance();

// Utility function for React components
export function useIframeErrorHandler() {
  return {
    handleError: (error: Error) => {
      const handler = IframeErrorHandler.getInstance();
      if (!handler["shouldFilterError"](error)) {
        throw error;
      }
    },
    createSafeIframe: (
      src: string,
      container: HTMLElement,
      options?: Parameters<
        typeof IframeErrorHandler.prototype.createSafeIframe
      >[2],
    ) => {
      return IframeErrorHandler.getInstance().createSafeIframe(
        src,
        container,
        options,
      );
    },
    wrapAsync: <T extends any[], R>(
      fn: (...args: T) => Promise<R>,
      context?: string,
    ) => {
      return IframeErrorHandler.getInstance().wrapAsyncFunction(fn, context);
    },
  };
}
