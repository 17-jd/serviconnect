-- Seed service categories
INSERT INTO public.service_categories (name, slug, icon, description, is_popular, sort_order) VALUES
('Plumbing', 'plumbing', 'droplets', 'Pipe repairs, installations, drain cleaning, and water heater services', true, 1),
('Electrical', 'electrical', 'zap', 'Wiring, panel upgrades, lighting installation, and electrical repairs', true, 2),
('Cleaning', 'cleaning', 'spray-can', 'Deep cleaning, regular maintenance, move-in/move-out cleaning', true, 3),
('Painting', 'painting', 'paintbrush', 'Interior/exterior painting, wallpaper, and surface preparation', true, 4),
('General Repairs', 'repairs', 'wrench', 'Handyman services, furniture assembly, and general fixes', true, 5),
('Moving & Hauling', 'moving', 'truck', 'Furniture moving, junk removal, and delivery services', true, 6),
('Landscaping', 'landscaping', 'trees', 'Lawn care, garden design, tree trimming, and outdoor maintenance', false, 7),
('HVAC', 'hvac', 'thermometer', 'Heating, cooling, ventilation installation and repair', false, 8),
('Appliance Repair', 'appliance-repair', 'settings', 'Washer, dryer, refrigerator, dishwasher repairs', false, 9),
('Pest Control', 'pest-control', 'bug', 'Insect, rodent, and wildlife removal and prevention', false, 10),
('Roofing', 'roofing', 'home', 'Roof repair, installation, inspection, and gutter services', false, 11),
('Tutoring', 'tutoring', 'book-open', 'Academic tutoring, test prep, and skills coaching', false, 12);
