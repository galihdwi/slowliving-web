import { HugeiconsIcon } from "@hugeicons/react";
import PlusSignIcon from "@hugeicons/core-free-icons/PlusSignIcon";
import { Button } from "@/components/ui/button";

type TopbarProps = {
  title: string;
  subtitle: string;
  userName?: string;
  canAdd?: boolean;
  onAdd?: () => void;
  onLogout: () => void;
};

export function Topbar({
  title,
  subtitle,
  userName,
  canAdd = true,
  onAdd,
  onLogout,
}: TopbarProps) {
  return (
    <header className="topbar">
      <div className="page-title">
        <p className="eyebrow">Administrasi RT</p>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <div className="topbar-actions" aria-label="Aksi halaman">
        {userName && <span className="user-chip">{userName}</span>}
        {canAdd && (
          <Button size="xs" onClick={onAdd}>
            <HugeiconsIcon icon={PlusSignIcon} size={15} strokeWidth={1.8} />
            Tambah Data
          </Button>
        )}
        <Button variant="outline" size="xs" onClick={onLogout}>
          Logout
        </Button>
      </div>
    </header>
  );
}
