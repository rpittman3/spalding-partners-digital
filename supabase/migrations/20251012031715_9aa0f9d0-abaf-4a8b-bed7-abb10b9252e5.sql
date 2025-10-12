-- Phase 1: Core Authentication & User Management

-- User Profiles (extends auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  company_name TEXT,
  address TEXT,
  work_phone TEXT,
  cell_phone TEXT,
  is_main_user BOOLEAN DEFAULT true,
  parent_user_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Roles (SECURITY: separate table to prevent privilege escalation)
CREATE TYPE public.app_role AS ENUM ('admin', 'client', 'sub_user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- CSV Import staging table (for initial client upload)
CREATE TABLE public.client_imports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  company_name TEXT,
  address TEXT,
  work_phone TEXT,
  cell_phone TEXT,
  categories TEXT,
  imported_at TIMESTAMPTZ DEFAULT NOW(),
  account_created BOOLEAN DEFAULT false,
  processed_at TIMESTAMPTZ
);

-- Access requests (for clients requesting portal access)
CREATE TABLE public.access_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  last_name TEXT NOT NULL,
  access_code TEXT NOT NULL,
  code_expires_at TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'pending',
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  used_at TIMESTAMPTZ
);

-- Categories (soft-delete enabled)
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  is_built_in BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert built-in categories
INSERT INTO public.categories (name, is_built_in) VALUES
  ('ALL', true),
  ('Payroll Only Clients', false),
  ('Business Clients', false),
  ('Non-Profit', false),
  ('Personal/Individual', false);

-- User-to-Category mapping (many-to-many)
CREATE TABLE public.user_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, category_id)
);

-- Documents uploaded by clients or admin
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  uploaded_by UUID REFERENCES public.profiles(id) NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_type TEXT NOT NULL,
  category TEXT,
  
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  extension_count INT DEFAULT 0,
  is_expired BOOLEAN DEFAULT false,
  purge_at TIMESTAMPTZ,
  
  is_seen_by_admin BOOLEAN DEFAULT false,
  is_seen_by_client BOOLEAN DEFAULT true,
  is_direct_to_client BOOLEAN DEFAULT false,
  is_archived BOOLEAN DEFAULT false,
  
  notes TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Automatically calculate expires_at on insert
CREATE OR REPLACE FUNCTION set_document_expiration()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.expires_at IS NULL THEN
    NEW.expires_at := NEW.uploaded_at + INTERVAL '1 year';
  END IF;
  NEW.purge_at := NEW.expires_at + INTERVAL '3 months';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_document_expiration
BEFORE INSERT ON public.documents
FOR EACH ROW EXECUTE FUNCTION set_document_expiration();

-- Resources with category filtering
CREATE TABLE public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_type TEXT NOT NULL,
  created_by UUID REFERENCES public.profiles(id) NOT NULL,
  is_important BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Resource-to-Category mapping (many-to-many)
CREATE TABLE public.resource_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(resource_id, category_id)
);

-- Track which resources clients have seen
CREATE TABLE public.resource_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  viewed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(resource_id, user_id)
);

-- Deadlines with category filtering
CREATE TABLE public.deadlines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE NOT NULL,
  created_by UUID REFERENCES public.profiles(id) NOT NULL,
  reminder_30_days_sent BOOLEAN DEFAULT false,
  reminder_15_days_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Deadline-to-Category mapping (many-to-many)
CREATE TABLE public.deadline_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deadline_id UUID REFERENCES public.deadlines(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(deadline_id, category_id)
);

-- Track which deadlines clients have seen
CREATE TABLE public.deadline_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deadline_id UUID REFERENCES public.deadlines(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  viewed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(deadline_id, user_id)
);

-- Rich text notifications
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  created_by UUID REFERENCES public.profiles(id) NOT NULL,
  is_important BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notification-to-Category mapping (many-to-many)
CREATE TABLE public.notification_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_id UUID REFERENCES public.notifications(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(notification_id, category_id)
);

-- Track notification status per user
CREATE TABLE public.notification_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_id UUID REFERENCES public.notifications(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  is_seen BOOLEAN DEFAULT false,
  is_archived BOOLEAN DEFAULT false,
  seen_at TIMESTAMPTZ,
  archived_at TIMESTAMPTZ,
  UNIQUE(notification_id, user_id)
);

-- Meeting consultation requests from clients
CREATE TABLE public.meeting_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  subject TEXT NOT NULL,
  
  option_1 TIMESTAMPTZ NOT NULL,
  option_2 TIMESTAMPTZ NOT NULL,
  option_3 TIMESTAMPTZ NOT NULL,
  
  status TEXT DEFAULT 'pending',
  selected_option INT,
  alternate_datetime TIMESTAMPTZ,
  admin_notes TEXT,
  responded_by UUID REFERENCES public.profiles(id),
  
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  responded_at TIMESTAMPTZ
);

-- Client notification preferences
CREATE TABLE public.user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  
  notify_deadlines BOOLEAN DEFAULT true,
  notify_resources BOOLEAN DEFAULT true,
  notify_notifications BOOLEAN DEFAULT true,
  
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comprehensive audit log
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id),
  action_type TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  details JSONB,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);

-- Archive old logs (for 90-day rotation)
CREATE TABLE public.audit_logs_archive (
  LIKE public.audit_logs INCLUDING ALL
);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES
  ('client-documents', 'client-documents', false),
  ('admin-resources', 'admin-resources', false),
  ('team-photos', 'team-photos', true);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_imports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.access_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deadlines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deadline_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deadline_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Security definer function to check role (prevents recursive RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS Policies
-- Profiles
CREATE POLICY "Users view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR parent_user_id = auth.uid());

CREATE POLICY "Admins view all profiles" ON public.profiles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins update all profiles" ON public.profiles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Documents
CREATE POLICY "Clients view own documents" ON public.documents
  FOR SELECT USING (user_id = auth.uid() OR uploaded_by = auth.uid() OR user_id IN (SELECT parent_user_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Admins view all documents" ON public.documents
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Clients upload own documents" ON public.documents
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Resources (visible based on categories) - FIXED: qualified column names
CREATE POLICY "View resources by category" ON public.resources
  FOR SELECT USING (
    public.has_role(auth.uid(), 'admin') OR
    EXISTS (
      SELECT 1 FROM public.resource_categories rc
      INNER JOIN public.user_categories uc ON rc.category_id = uc.category_id
      WHERE rc.resource_id = resources.id AND uc.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.resource_categories rc
      INNER JOIN public.categories c ON rc.category_id = c.id
      WHERE rc.resource_id = resources.id AND c.name = 'ALL'
    )
  );

CREATE POLICY "Admins manage resources" ON public.resources
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Deadlines (visible based on categories) - FIXED: qualified column names
CREATE POLICY "View deadlines by category" ON public.deadlines
  FOR SELECT USING (
    public.has_role(auth.uid(), 'admin') OR
    EXISTS (
      SELECT 1 FROM public.deadline_categories dc
      INNER JOIN public.user_categories uc ON dc.category_id = uc.category_id
      WHERE dc.deadline_id = deadlines.id AND uc.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.deadline_categories dc
      INNER JOIN public.categories c ON dc.category_id = c.id
      WHERE dc.deadline_id = deadlines.id AND c.name = 'ALL'
    )
  );

CREATE POLICY "Admins manage deadlines" ON public.deadlines
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Notifications (visible based on categories) - FIXED: qualified column names
CREATE POLICY "View notifications by category" ON public.notifications
  FOR SELECT USING (
    public.has_role(auth.uid(), 'admin') OR
    EXISTS (
      SELECT 1 FROM public.notification_categories nc
      INNER JOIN public.user_categories uc ON nc.category_id = uc.category_id
      WHERE nc.notification_id = notifications.id AND uc.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.notification_categories nc
      INNER JOIN public.categories c ON nc.category_id = c.id
      WHERE nc.notification_id = notifications.id AND c.name = 'ALL'
    )
  );

CREATE POLICY "Admins manage notifications" ON public.notifications
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Meeting requests
CREATE POLICY "Clients view own meeting requests" ON public.meeting_requests
  FOR SELECT USING (user_id = auth.uid() OR user_id IN (SELECT parent_user_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Admins view all meeting requests" ON public.meeting_requests
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Clients create meeting requests" ON public.meeting_requests
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins update meeting requests" ON public.meeting_requests
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- User preferences
CREATE POLICY "Users manage own preferences" ON public.user_preferences
  FOR ALL USING (user_id = auth.uid());

-- Categories
CREATE POLICY "Everyone can view active categories" ON public.categories
  FOR SELECT USING (is_deleted = false);

CREATE POLICY "Admins manage categories" ON public.categories
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Storage policies
CREATE POLICY "Users upload own documents" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'client-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users view own documents" ON storage.objects
  FOR SELECT USING (bucket_id = 'client-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins view all client documents" ON storage.objects
  FOR SELECT USING (bucket_id = 'client-documents' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage admin resources" ON storage.objects
  FOR ALL USING (bucket_id = 'admin-resources' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Everyone views team photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'team-photos');

CREATE POLICY "Admins manage team photos" ON storage.objects
  FOR ALL USING (bucket_id = 'team-photos' AND public.has_role(auth.uid(), 'admin'));