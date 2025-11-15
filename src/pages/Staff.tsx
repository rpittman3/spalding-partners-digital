import { Mail, Phone } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import teamPhoto from "@/assets/team-photo.jpg";
import DOMPurify from 'dompurify';
interface StaffMember {
  id: string;
  name: string;
  position: string;
  email: string;
  photo_path: string | null;
  phone: string | null;
  bio: string | null;
  display_order: number;
}
const Staff = () => {
  const {
    data: staffMembers,
    isLoading
  } = useQuery({
    queryKey: ['staff'],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from('staff').select('*').eq('is_active', true).order('display_order', {
        ascending: true
      });
      if (error) throw error;
      return data as StaffMember[];
    }
  });
  const getPhotoUrl = (photoPath: string | null) => {
    if (!photoPath) return null;
    if (photoPath.startsWith('http')) return photoPath;
    const {
      data
    } = supabase.storage.from('team-photos').getPublicUrl(photoPath);
    return data.publicUrl;
  };
  return <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-20 pb-16">
        {/* Title Section */}
        <section className="pt-16 pb-8">
          <div className="container-custom">
            <h1 className="text-4xl md:text-5xl font-bold text-primary text-center">
              Meet Our Team    
            </h1>
          </div>
        </section>

        {/* Team Photo Section */}
        <section className="pb-12">
          <div className="container-custom max-w-4xl">
            <img src={teamPhoto} alt="Our Team" className="w-full h-auto rounded-lg shadow-lg" />
          </div>
        </section>

        {/* Description Section */}
        <section className="pb-16">
          <div className="container-custom max-w-4xl text-center">
            <p className="leading-relaxed text-foreground mb-4 text-3xl">Dedicated professionals committed to your financial success. We believe in the power of personal relationships and providing boutique service that makes a difference.</p>
            
          </div>
        </section>

        {/* Team Members Section */}
        <section className="pb-16">
          <div className="container-custom">
            {isLoading ? <div className="text-center">Loading team members...</div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
                {staffMembers?.map(member => <div key={member.id} className="perspective-1000 h-[500px]">
                    <div className="relative w-full h-full transition-transform duration-700 transform-style-3d hover:rotate-y-180 group cursor-pointer">
                      {/* Front of card */}
                      <div className="absolute inset-0 backface-hidden flex flex-col items-center p-6 bg-card rounded-lg border shadow-sm">
                        <Avatar className="w-56 h-56 mb-6">
                          <AvatarImage src={getPhotoUrl(member.photo_path) || undefined} alt={member.name} />
                          <AvatarFallback className="text-4xl bg-primary/10 text-primary">
                            {member.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <h3 className="text-2xl font-bold text-primary mb-2 text-center">
                          {member.name}
                        </h3>
                        <p className="text-base text-muted-foreground mb-4 text-center">
                          {member.position}
                        </p>
                        
                        <div className="space-y-2 w-full">
                          <a href={`mailto:${member.email}`} onClick={(e) => e.stopPropagation()} className="flex items-center justify-center gap-2 text-sm text-primary hover:text-accent transition-colors">
                            <Mail className="h-4 w-4" />
                            {member.email}
                          </a>
                          
                          {member.phone && <a href={`tel:${member.phone}`} onClick={(e) => e.stopPropagation()} className="flex items-center justify-center gap-2 text-sm text-primary hover:text-accent transition-colors">
                              <Phone className="h-4 w-4" />
                              {member.phone}
                            </a>}
                        </div>
                      </div>

                      {/* Back of card */}
                      <div className="absolute inset-0 backface-hidden rotate-y-180 flex flex-col items-center justify-center p-6 bg-card rounded-lg border shadow-sm overflow-y-auto">
                        <h3 className="text-xl font-bold text-primary mb-4 text-center">
                          {member.name}
                        </h3>
                        {member.bio ? (
                          <div className="text-sm text-muted-foreground text-center prose prose-sm max-w-none" dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(member.bio)
                          }} />
                        ) : (
                          <p className="text-sm text-muted-foreground text-center">No bio available</p>
                        )}
                      </div>
                    </div>
                  </div>)}
              </div>}
          </div>
        </section>
      </main>

      <Footer />
    </div>;
};
export default Staff;