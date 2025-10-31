-- Create FAQs table
CREATE TABLE public.faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_by uuid NOT NULL REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Everyone can view active FAQs"
ON public.faqs
FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins manage FAQs"
ON public.faqs
FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Create index for ordering
CREATE INDEX idx_faqs_display_order ON public.faqs(display_order);

-- Insert existing FAQs from the page
INSERT INTO public.faqs (question, answer, display_order, created_by) VALUES
('What makes Spalding & Partners different from other accounting firms?', 'We''re a boutique firm that takes an ''I know who you are'' approach. Unlike large corporate firms where you''re just a number, we build genuine, long-term relationships with our clients. As a woman-owned practice with over 25 years of experience, we provide personalized attention and tailored solutions for niche clientele. We''re small by design—it allows us to deliver exceptional quality and maintain the personal touch that defines boutique service.', 1, (SELECT id FROM auth.users WHERE email IN (SELECT email FROM profiles WHERE id IN (SELECT user_id FROM user_roles WHERE role = 'admin')) LIMIT 1)),
('What types of clients do you work with?', 'We specialize in serving small to mid-sized businesses, entrepreneurs, and select individual clients who value a relationship-based approach to financial services. We''re not focused on volume—we carefully select clients who appreciate personalized service and deep expertise. Our niche includes businesses that need more than basic bookkeeping and individuals who want a trusted advisor who truly understands their financial goals.', 2, (SELECT id FROM auth.users WHERE email IN (SELECT email FROM profiles WHERE id IN (SELECT user_id FROM user_roles WHERE role = 'admin')) LIMIT 1)),
('What services do you offer?', 'We offer comprehensive Accounting Services (bookkeeping, financial statements, payroll support), Tax Services (individual & business tax preparation, planning, IRS representation), Financial Management (budgeting, cash flow analysis, CFO services), and Business Advisory (entity selection, consulting, growth strategies). Each service is tailored to your unique needs.', 3, (SELECT id FROM auth.users WHERE email IN (SELECT email FROM profiles WHERE id IN (SELECT user_id FROM user_roles WHERE role = 'admin')) LIMIT 1)),
('How long has your firm been in business?', 'Spalding & Partners Financial Services, LLC was founded in 2000. We''ve been providing boutique accounting and financial services to Connecticut businesses and individuals for over 25 years.', 4, (SELECT id FROM auth.users WHERE email IN (SELECT email FROM profiles WHERE id IN (SELECT user_id FROM user_roles WHERE role = 'admin')) LIMIT 1)),
('Do you provide services to individuals or just businesses?', 'We work with both businesses and individuals. Our business clients range from small startups to established companies needing CFO-level guidance, while our individual clients typically seek expert tax preparation, planning, and financial advice. In all cases, we provide the same personalized, relationship-focused approach.', 5, (SELECT id FROM auth.users WHERE email IN (SELECT email FROM profiles WHERE id IN (SELECT user_id FROM user_roles WHERE role = 'admin')) LIMIT 1)),
('What is your approach to client service?', 'We believe in building lasting relationships. When you work with us, you''re not passed around to different team members—you work directly with experienced professionals who get to know you, your business, and your goals. We take the time to understand your story, remember what matters to you, and provide solutions that are truly customized to your situation.', 6, (SELECT id FROM auth.users WHERE email IN (SELECT email FROM profiles WHERE id IN (SELECT user_id FROM user_roles WHERE role = 'admin')) LIMIT 1)),
('How do you ensure confidentiality?', 'We maintain the highest standards of professional ethics and confidentiality. Our boutique model, with a small dedicated staff, ensures that your sensitive financial information is handled by trusted professionals. We''ve built our reputation on integrity, and client confidentiality is paramount to everything we do.', 7, (SELECT id FROM auth.users WHERE email IN (SELECT email FROM profiles WHERE id IN (SELECT user_id FROM user_roles WHERE role = 'admin')) LIMIT 1)),
('Can you help with IRS issues or audits?', 'Yes. We provide IRS representation services and can assist with tax issues, audits, and disputes. With over 25 years of tax expertise, we know how to navigate complex IRS matters and advocate for our clients effectively.', 8, (SELECT id FROM auth.users WHERE email IN (SELECT email FROM profiles WHERE id IN (SELECT user_id FROM user_roles WHERE role = 'admin')) LIMIT 1)),
('Do you offer CFO services for small businesses?', 'Absolutely. Many small businesses need CFO-level financial guidance but can''t afford a full-time CFO. We provide strategic financial management, budgeting, forecasting, cash flow analysis, and high-level business advisory services tailored to your company''s size and needs.', 9, (SELECT id FROM auth.users WHERE email IN (SELECT email FROM profiles WHERE id IN (SELECT user_id FROM user_roles WHERE role = 'admin')) LIMIT 1)),
('How do I get started working with your firm?', 'Simply contact us to schedule a consultation. We''ll take the time to understand your needs, discuss how we can help, and determine if we''re the right fit for each other. We''re selective about who we work with because we''re committed to providing exceptional, personalized service to every client.', 10, (SELECT id FROM auth.users WHERE email IN (SELECT email FROM profiles WHERE id IN (SELECT user_id FROM user_roles WHERE role = 'admin')) LIMIT 1)),
('What are your fees?', 'Our fees vary based on the scope and complexity of services required. We believe in transparent pricing and will provide a clear fee structure during your initial consultation. Because we offer boutique, customized service, our pricing reflects the value of personalized attention and deep expertise rather than one-size-fits-all packages.', 11, (SELECT id FROM auth.users WHERE email IN (SELECT email FROM profiles WHERE id IN (SELECT user_id FROM user_roles WHERE role = 'admin')) LIMIT 1)),
('Are you accepting new clients?', 'We carefully evaluate new client opportunities to ensure we can provide the level of service that defines our practice. We''re not focused on rapid growth—we''re focused on quality relationships. Contact us to discuss your needs, and we''ll let you know if we''re currently able to take on new clients.', 12, (SELECT id FROM auth.users WHERE email IN (SELECT email FROM profiles WHERE id IN (SELECT user_id FROM user_roles WHERE role = 'admin')) LIMIT 1));