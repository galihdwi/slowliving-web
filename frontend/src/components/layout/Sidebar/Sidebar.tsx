import { HugeiconsIcon } from "@hugeicons/react";
import Cancel01Icon from "@hugeicons/core-free-icons/Cancel01Icon";
import { appConfig } from "@/config/appConfig";
import { navigation } from "@/config/navigation";
import type { PageKey } from "@/types/admin";

type SidebarProps = {
  activePage: PageKey;
  onSelectPage: (page: PageKey) => void;
  onClose: () => void;
};

export function Sidebar({ activePage, onSelectPage, onClose }: SidebarProps) {
  return (
    <aside className="sidebar" aria-label="Navigasi utama">
      <div className="brand-block">
        <div>
          <strong>{appConfig.name}</strong>
          <span>{appConfig.communityName}</span>
        </div>
        <button
          type="button"
          className="sidebar-close"
          aria-label="Tutup navigasi"
          onClick={onClose}
        >
          <HugeiconsIcon icon={Cancel01Icon} size={18} strokeWidth={1.8} />
        </button>
      </div>

      <nav className="nav-list">
        {navigation.map((item) => (
          <button
            key={item.key}
            type="button"
            className={activePage === item.key ? "nav-item active" : "nav-item"}
            aria-current={activePage === item.key ? "page" : undefined}
            onClick={() => onSelectPage(item.key)}
          >
            <HugeiconsIcon icon={item.icon} size={18} strokeWidth={1.8} />
            <span>{item.label}</span>
            <small>{item.hint}</small>
          </button>
        ))}
      </nav>
    </aside>
  );
}
