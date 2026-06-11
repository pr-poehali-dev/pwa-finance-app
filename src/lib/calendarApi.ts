import funcUrls from "../../backend/func2url.json";
import type { CalEvent, Contact } from "@/pages/sections/types";

const BASE = (funcUrls as Record<string, string>).calendar;

export async function fetchContacts(): Promise<Contact[]> {
  const r = await fetch(`${BASE}?resource=contacts`);
  return r.json();
}

export async function createContact(c: Omit<Contact, "id">): Promise<number> {
  const r = await fetch(`${BASE}?resource=contacts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(c),
  });
  const data = await r.json();
  return data.id;
}

export async function fetchEvents(): Promise<CalEvent[]> {
  const r = await fetch(`${BASE}?resource=events`);
  return r.json();
}

export async function createEvent(e: Omit<CalEvent, "id">): Promise<number> {
  const r = await fetch(`${BASE}?resource=events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(e),
  });
  const data = await r.json();
  return data.id;
}
