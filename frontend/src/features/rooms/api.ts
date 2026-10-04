import type { Room } from "@/types/room";

// TODO: ganti dengan axios.get("/rooms") dari lib/axios.ts setelah endpoint siap.
const placeholderRooms: Room[] = [
  { id: 1, slug: "apex-boardroom-suite", name: "The Apex Boardroom & Suite", buildingName: "SCBD Tower 2", typeName: "Executive Boardroom", address: "SCBD Tower 2, Level 38, South Jakarta", capacity: 12, price: 500000, priceUnit: "daily", coverImage: "/images/rooms/apex.jpg" },
  { id: 2, slug: "horizon-media-suite", name: "Horizon Media Suite", buildingName: "SCBD", typeName: "Meeting room", address: "SCBD, South Jakarta", capacity: 16, price: 750000, priceUnit: "daily", coverImage: "/images/rooms/horizon.jpg" },
  { id: 3, slug: "atrium-dedicated-studio", name: "Atrium Dedicated Studio", buildingName: "Thamrin Nine", typeName: "Workspace", address: "Thamrin Nine, Central Jakarta", capacity: 10, price: 620000, priceUnit: "daily", coverImage: "/images/rooms/atrium.jpg" },
  { id: 4, slug: "aurora-flagship-hub", name: "Aurora Flagship Hub", buildingName: "Mega Kuningan", typeName: "Event space", address: "Mega Kuningan, South Jakarta", capacity: 60, price: 950000, priceUnit: "daily", coverImage: "/images/rooms/aurora.jpg" },
  { id: 5, slug: "metropolitan-private-suite", name: "Metropolitan Private Suite", buildingName: "Sudirman", typeName: "Private office", address: "Sudirman, Central Jakarta", capacity: 8, price: 480000, priceUnit: "daily", coverImage: "/images/rooms/metropolitan.jpg" },
];

export async function fetchRooms(): Promise<Room[]> {
  return placeholderRooms;
}