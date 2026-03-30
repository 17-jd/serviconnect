export const SERVICE_CATEGORIES = [
  { name: "Plumbing", slug: "plumbing", icon: "droplets", description: "Pipe repairs, installations, drain cleaning, and water heater services" },
  { name: "Electrical", slug: "electrical", icon: "zap", description: "Wiring, panel upgrades, lighting installation, and electrical repairs" },
  { name: "Cleaning", slug: "cleaning", icon: "spray-can", description: "Deep cleaning, regular maintenance, move-in/move-out cleaning" },
  { name: "Painting", slug: "painting", icon: "paintbrush", description: "Interior/exterior painting, wallpaper, and surface preparation" },
  { name: "General Repairs", slug: "repairs", icon: "wrench", description: "Handyman services, furniture assembly, and general fixes" },
  { name: "Moving & Hauling", slug: "moving", icon: "truck", description: "Furniture moving, junk removal, and delivery services" },
  { name: "Landscaping", slug: "landscaping", icon: "trees", description: "Lawn care, garden design, tree trimming, and outdoor maintenance" },
  { name: "HVAC", slug: "hvac", icon: "thermometer", description: "Heating, cooling, ventilation installation and repair" },
  { name: "Appliance Repair", slug: "appliance-repair", icon: "settings", description: "Washer, dryer, refrigerator, dishwasher repairs" },
  { name: "Pest Control", slug: "pest-control", icon: "bug", description: "Insect, rodent, and wildlife removal and prevention" },
  { name: "Roofing", slug: "roofing", icon: "home", description: "Roof repair, installation, inspection, and gutter services" },
  { name: "Tutoring", slug: "tutoring", icon: "book-open", description: "Academic tutoring, test prep, and skills coaching" },
] as const;

export const DURATION_OPTIONS = [
  { value: 1, label: "1 Hour", description: "Quick service" },
  { value: 2, label: "2 Hours", description: "Standard service" },
  { value: 3, label: "3 Hours", description: "Extended service" },
] as const;

export const PLATFORM_FEE_PERCENT = 15;

export const BOOKING_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: "Pending", color: "warning" },
  confirmed: { label: "Confirmed", color: "primary" },
  contract_pending: { label: "Contract Pending", color: "warning" },
  contract_signed: { label: "Contract Signed", color: "primary" },
  in_progress: { label: "In Progress", color: "primary" },
  completed: { label: "Completed", color: "success" },
  cancelled: { label: "Cancelled", color: "danger" },
  disputed: { label: "Disputed", color: "danger" },
};
