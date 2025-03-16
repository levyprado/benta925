import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

type SearchInputProps = {
  searchValue: string;
  setSearchValue: (searchValue: string) => void;
  placeholder: string;
} & React.ComponentProps<"input">;

export default function SearchInput({
  searchValue,
  setSearchValue,
  placeholder,
  ...props
}: SearchInputProps) {
  return (
    <div className="*:not-first:mt-2 w-full">
      <div className="relative">
        <Input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          type="text"
          placeholder={placeholder}
          className="peer ps-9"
          {...props}
        />
        <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
          <SearchIcon size={16} aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
