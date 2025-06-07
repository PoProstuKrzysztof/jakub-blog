import Image from "next/image"

interface AuthorImageProps {
  className?: string
  alt?: string
}

export function AuthorImage({ className = "", alt = "Jakub - Autor bloga" }: AuthorImageProps) {
  return (
    <div className={`relative ${className}`}>
      <Image
        src="/images/placeholder-author.svg"
        alt={alt}
        fill
        className="object-cover"
      />
    </div>
  )
} 