-- Create trigger function for audit logging
CREATE OR REPLACE FUNCTION public.log_audit_event()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id uuid;
  action_type text;
  old_data jsonb;
  new_data jsonb;
BEGIN
  -- Get the current authenticated user
  current_user_id := auth.uid();
  
  -- Determine action type
  IF TG_OP = 'INSERT' THEN
    action_type := 'CREATE';
    new_data := to_jsonb(NEW);
  ELSIF TG_OP = 'UPDATE' THEN
    action_type := 'UPDATE';
    old_data := to_jsonb(OLD);
    new_data := to_jsonb(NEW);
  ELSIF TG_OP = 'DELETE' THEN
    action_type := 'DELETE';
    old_data := to_jsonb(OLD);
  END IF;

  -- Insert audit log
  INSERT INTO public.audit_logs (
    user_id,
    action_type,
    entity_type,
    entity_id,
    details
  ) VALUES (
    current_user_id,
    action_type,
    TG_TABLE_NAME,
    CASE 
      WHEN TG_OP = 'DELETE' THEN OLD.id
      ELSE NEW.id
    END,
    jsonb_build_object(
      'operation', TG_OP,
      'table', TG_TABLE_NAME,
      'old_data', old_data,
      'new_data', new_data,
      'changed_fields', CASE 
        WHEN TG_OP = 'UPDATE' THEN (
          SELECT jsonb_object_agg(key, value)
          FROM jsonb_each(new_data)
          WHERE new_data->key IS DISTINCT FROM old_data->key
        )
        ELSE NULL
      END
    )
  );

  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create triggers for profiles table (client/user actions)
DROP TRIGGER IF EXISTS audit_profiles_insert ON public.profiles;
CREATE TRIGGER audit_profiles_insert
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.log_audit_event();

DROP TRIGGER IF EXISTS audit_profiles_update ON public.profiles;
CREATE TRIGGER audit_profiles_update
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.log_audit_event();

DROP TRIGGER IF EXISTS audit_profiles_delete ON public.profiles;
CREATE TRIGGER audit_profiles_delete
  AFTER DELETE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.log_audit_event();

-- Create triggers for documents table (document uploads/management)
DROP TRIGGER IF EXISTS audit_documents_insert ON public.documents;
CREATE TRIGGER audit_documents_insert
  AFTER INSERT ON public.documents
  FOR EACH ROW
  EXECUTE FUNCTION public.log_audit_event();

DROP TRIGGER IF EXISTS audit_documents_update ON public.documents;
CREATE TRIGGER audit_documents_update
  AFTER UPDATE ON public.documents
  FOR EACH ROW
  EXECUTE FUNCTION public.log_audit_event();

DROP TRIGGER IF EXISTS audit_documents_delete ON public.documents;
CREATE TRIGGER audit_documents_delete
  AFTER DELETE ON public.documents
  FOR EACH ROW
  EXECUTE FUNCTION public.log_audit_event();