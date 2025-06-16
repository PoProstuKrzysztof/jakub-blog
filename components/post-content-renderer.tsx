"use client";

import { useEffect, useRef } from "react";
import { ChartComponentDynamic } from "./editor/chart-component-dynamic";
import { useIframeErrorHandler } from "@/lib/utils/iframe-error-handler";

interface PostContentRendererProps {
  content: string;
  className?: string;
}

export function PostContentRenderer({
  content,
  className,
}: PostContentRendererProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const { handleError } = useIframeErrorHandler();

  useEffect(() => {
    if (!contentRef.current) return;

    try {
      // Znajdź wszystkie kontenery wykresów i zastąp je komponentami React
      const chartContainers =
        contentRef.current.querySelectorAll(".chart-container");

      chartContainers.forEach((container) => {
        const chartType = container.getAttribute("data-chart-type") as
          | "bar"
          | "line"
          | "pie";
        const chartDataString = container.getAttribute("data-chart-data");

        if (chartDataString) {
          try {
            const chartData = JSON.parse(decodeURIComponent(chartDataString));

            // Utwórz nowy element div dla wykresu
            const chartDiv = document.createElement("div");
            chartDiv.className = "chart-wrapper my-6";

            // Zastąp placeholder rzeczywistym wykresem
            container.innerHTML = "";
            container.appendChild(chartDiv);

            // Renderuj wykres (w rzeczywistej aplikacji użyłbyś ReactDOM.render lub portal)
            // Na razie zostawiamy placeholder z lepszym stylem
            chartDiv.innerHTML = `
            <div class="bg-white border rounded-lg p-6 shadow-sm">
              <div class="flex items-center justify-center h-64 bg-gray-50 rounded border-2 border-dashed border-gray-200">
                <div class="text-center">
                  <div class="text-2xl mb-2">📊</div>
                  <p class="text-gray-600 font-medium">Wykres ${chartType.toUpperCase()}</p>
                  <p class="text-sm text-gray-500">Dane: ${Object.keys(chartData).join(", ")}</p>
                </div>
              </div>
            </div>
          `;
          } catch (error) {
            console.error("Error parsing chart data:", error);
            container.innerHTML = `
            <div class="bg-red-50 border border-red-200 rounded-lg p-4 my-4">
              <p class="text-red-700">Błąd w danych wykresu</p>
            </div>
          `;
          }
        }
      });

      // Dodaj bezpieczne style dla wszystkich iframes
      const iframes = contentRef.current.querySelectorAll("iframe");
      iframes.forEach((iframe) => {
        // Add error handling for iframes
        iframe.addEventListener("error", (event) => {
          console.debug("Iframe error handled:", event);
          // Replace with fallback content
          const fallback = document.createElement("div");
          fallback.className =
            "bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center my-6";
          fallback.innerHTML = `
          <div class="text-center">
            <svg class="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
            <p class="text-gray-500 font-medium">Nie udało się załadować treści multimedialnej</p>
            <p class="text-sm text-gray-400 mt-2">Sprawdź ustawienia przeglądarki lub wyłącz blokady reklam</p>
          </div>
        `;
          iframe.parentNode?.replaceChild(fallback, iframe);
        });

        // Configure iframe safely
        iframe.setAttribute("loading", "lazy");
        iframe.setAttribute(
          "referrerpolicy",
          "strict-origin-when-cross-origin",
        );

        // YouTube specific handling
        if (
          iframe.src.includes("youtube.com") ||
          iframe.src.includes("youtu.be")
        ) {
          iframe.setAttribute("class", "w-full aspect-video rounded-lg my-6");
          iframe.setAttribute(
            "allow",
            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
          );
          iframe.setAttribute("allowfullscreen", "true");
        }

        // Vimeo specific handling
        else if (iframe.src.includes("vimeo.com")) {
          iframe.setAttribute("class", "w-full aspect-video rounded-lg my-6");
          iframe.setAttribute(
            "allow",
            "autoplay; fullscreen; picture-in-picture",
          );
          iframe.setAttribute("allowfullscreen", "true");
        }

        // Generic iframe styling
        else {
          iframe.setAttribute("class", "w-full rounded-lg my-6 border");
          iframe.style.minHeight = "200px";
        }
      });

      // Dodaj style dla obrazów z obsługą błędów
      const images = contentRef.current.querySelectorAll("img");
      images.forEach((img) => {
        img.setAttribute("class", "max-w-full h-auto rounded-lg my-4 mx-auto");
        img.setAttribute("loading", "lazy");

        // Add error handling for images
        img.addEventListener("error", (event) => {
          console.debug("Image load error, using placeholder:", event);
          img.src = "/placeholder.svg?height=300&width=600";
          img.alt = "Nie udało się załadować obrazu";
        });
      });

      // Dodaj style dla tabel
      const tables = contentRef.current.querySelectorAll("table");
      tables.forEach((table) => {
        table.setAttribute(
          "class",
          "w-full border-collapse border border-gray-300 my-6",
        );

        // Style dla komórek tabeli
        const cells = table.querySelectorAll("td, th");
        cells.forEach((cell) => {
          cell.setAttribute("class", "border border-gray-300 px-4 py-2");
        });

        // Style dla nagłówków tabeli
        const headers = table.querySelectorAll("th");
        headers.forEach((header) => {
          header.setAttribute(
            "class",
            "border border-gray-300 px-4 py-2 bg-gray-100 font-semibold",
          );
        });
      });

      // Dodaj style dla list zadań
      const taskLists = contentRef.current.querySelectorAll(
        'ul[data-type="taskList"]',
      );
      taskLists.forEach((list) => {
        list.setAttribute("class", "space-y-2 my-4");

        const taskItems = list.querySelectorAll('li[data-type="taskItem"]');
        taskItems.forEach((item) => {
          item.setAttribute("class", "flex items-center space-x-2");
        });
      });
    } catch (error) {
      // Handle any DOM manipulation errors
      handleError(error as Error);
    }
  }, [content, handleError]);

  return (
    <div
      ref={contentRef}
      className={`prose prose-lg max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
