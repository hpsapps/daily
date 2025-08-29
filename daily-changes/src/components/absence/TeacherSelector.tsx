import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const TeacherSelector = () => {
  const { state } = useContext(AppContext);
  const { teachers } = state;

  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  const teacherOptions = teachers.map(teacher => ({
    value: teacher.id,
    label: teacher.name,
  }));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? teacherOptions.find((teacher) => teacher.value === value)?.label
            : "Select teacher..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search teacher..." />
          <CommandEmpty>No teacher found.</CommandEmpty>
          <CommandGroup>
            {teacherOptions.map((teacher) => (
              <CommandItem
                key={teacher.value}
                value={teacher.value}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === teacher.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {teacher.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default TeacherSelector;
