
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

interface ProfileLinksProps {
  form: UseFormReturn<any>;
}

const ProfileLinks: React.FC<ProfileLinksProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="linkedinUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LinkedIn URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://linkedin.com/in/username" {...field} className="bg-black/20 border-white/20" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="websiteUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Site web URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://monsite.com" {...field} className="bg-black/20 border-white/20" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-6">
          <FormField
            control={form.control}
            name="portfolioUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Portfolio/Github URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://github.com/username" {...field} className="bg-black/20 border-white/20" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="region"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Région</FormLabel>
                <FormControl>
                  <Input placeholder="Paris, Lyon, Remote..." {...field} className="bg-black/20 border-white/20" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <FormField
        control={form.control}
        name="hasAIBadge"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border border-white/20 p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Badge IA</FormLabel>
              <FormDescription className="text-white/60">
                Activez cette option si vous avez une expertise en Intelligence Artificielle
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};

export default ProfileLinks;
