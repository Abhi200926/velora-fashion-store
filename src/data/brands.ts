import { supabase } from '@/lib/supabase';
import type { Brand } from '@/types';

export async function fetchBrands(): Promise<Brand[]> {
  const { data, error } = await supabase
    .from('brands')
    .select('id, slug, name, description, logo_url, cover_url, country, category')
    .order('name');
  if (error) throw error;
  return (data ?? []) as Brand[];
}

export async function fetchBrandBySlug(slug: string): Promise<Brand | null> {
  const { data, error } = await supabase
    .from('brands')
    .select('id, slug, name, description, logo_url, cover_url, country, category')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  return (data as Brand) ?? null;
}
