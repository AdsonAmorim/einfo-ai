import {
  CpuIcon,
  GpuIcon,
  HardDriveIcon,
  KeyboardIcon,
  MemoryStickIcon,
  MonitorIcon,
  PackageIcon,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconsByCategory: Record<string, LucideIcon> = {
  processadores: CpuIcon,
  "placas-de-video": GpuIcon,
  "memoria-ram": MemoryStickIcon,
  armazenamento: HardDriveIcon,
  perifericos: KeyboardIcon,
  monitores: MonitorIcon,
};

export function ProductImage({
  imageUrl,
  name,
  categorySlug,
  className,
}: {
  imageUrl: string | null;
  name: string;
  categorySlug: string;
  className?: string;
}) {
  const Icon = iconsByCategory[categorySlug] ?? PackageIcon;

  return (
    <div
      className={cn(
        "flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-muted to-primary/10",
        className,
      )}
    >
      {imageUrl ? (
        // URL arbitrária cadastrada no admin: <img> evita configurar remotePatterns
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt={name} className="size-full object-cover" />
      ) : (
        <Icon className="size-14 text-primary/60" strokeWidth={1.25} aria-hidden />
      )}
    </div>
  );
}
