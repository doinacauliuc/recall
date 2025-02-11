import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"
import { LayoutDashboard, NotebookText, Book, CreditCard, MessageSquareText } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Dashboard from "@/app/dashboard/page"

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Notes",
    url: "#",
    icon: NotebookText,
  },
  {
    title: "Summaries",
    url: "#",
    icon: Book,
  },
  {
    title: "Flashcards",
    url: "#",
    icon: CreditCard,
  },
  {
    title: "Revise",
    url: "#",
    icon: MessageSquareText,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },

]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Recall</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
