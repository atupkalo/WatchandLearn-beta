'use client';

import type { ReactNode } from "react";
import { Popover } from "@heroui/react";

interface PopoverProps {
  title?: string;
  trigger: ReactNode;
  content: ReactNode;
}

export default function PopoverCustom({
  title,
  trigger,
  content,
}: PopoverProps) {
  return (
    <Popover>
      <Popover.Trigger>{trigger}</Popover.Trigger>
      <Popover.Content>
        <Popover.Arrow />
        <Popover.Dialog>
          {title ? <Popover.Heading>{title}</Popover.Heading> : null}
          {content}
        </Popover.Dialog>
      </Popover.Content>
    </Popover>
  );
}
