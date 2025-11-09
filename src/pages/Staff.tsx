import { Mail } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface StaffMember {
  id: string;
  name: string;
  position: string;
  email: string;
  photo_path: string | null;
  display_order: number;
}
const Staff = () => {
  const { data: staffMembers, isLoading } = useQuery({
    queryKey: ['staff'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as StaffMember[];
    }
  });

  const getPhotoUrl = (photoPath: string | null) => {
    if (!photoPath) return null;
    if (photoPath.startsWith('http')) return photoPath;
    const { data } = supabase.storage.from('team-photos').getPublicUrl(photoPath);
    return data.publicUrl;
  };

  return <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-15 pb-[60px]">
        {/* Hero Section */}
        <section className="pt-28 pb-16 md:pt-32 md:pb-24 bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto offset-header">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Meet Our Team
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Dedicated professionals committed to your financial success. We believe in the power of personal relationships and providing boutique service that makes a difference.
              </p>
            </div>
          </div>
        </section>

        {/* Team Members Grid */}
        <section className="py-16 md:py-24">
          <div className="container-custom">
            {isLoading ? (
              <div className="text-center">Loading team members...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {staffMembers?.map((member) => (
                  <div key={member.id} className="flex flex-col items-center text-center">
                    <Avatar className="w-48 h-48 mb-4 border-4 border-primary/10">
                      <AvatarImage src={getPhotoUrl(member.photo_path) || undefined} alt={member.name} />
                      <AvatarFallback className="text-3xl bg-primary/10 text-primary">
                        {member.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-bold text-primary mb-1">
                      {member.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {member.position}
                    </p>
                    <a 
                      href={`mailto:${member.email}`} 
                      className="flex items-center gap-2 text-sm text-primary hover:text-accent transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                      {member.email}
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

      </main>

      <Footer />
    </div>;
};
export default Staff;