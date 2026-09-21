/* ================================================================
   YORU — Data Layer (Supabase Integration)
   Handles all data fetching and mutation
   ================================================================ */

window.Yoru = window.Yoru || {};

// ===== QUERY HELPERS (Async) =====

Yoru.getNovelById = async function(id) {
  const { data, error } = await Yoru.supabase
    .from('novels')
    .select('*, chapters(*)')
    .eq('id', id)
    .single();
    
  if (error || !data) return null;
  
  // Sort chapters
  if (data.chapters) {
    data.chapters.sort((a, b) => a.order_index - b.order_index);
  } else {
    data.chapters = [];
  }
  
  // Handle cover formatting
  if (!data.cover) {
    data.cover = {
      image: data.cover_image,
      gradient: data.cover_gradient,
      accent: data.cover_accent
    };
  }
  
  return data;
};

Yoru.getAllNovels = async function() {
  let query = Yoru.supabase.from('novels').select('*, chapters(id)');
  
  const { data, error } = await query.order('created_at', { ascending: false });
  if (error || !data) return [];
  
  return data.map(novel => {
    if (!novel.cover) {
      novel.cover = {
        image: novel.cover_image,
        gradient: novel.cover_gradient,
        accent: novel.cover_accent
      };
    }
    return novel;
  });
};

Yoru.getNovelsByAuthor = async function(author) {
  
  const { data, error } = await query.order('order_index', { ascending: true });
  if (error || !data) return [];
  
  return data.map(novel => {
    if (!novel.cover) {
      novel.cover = {
        image: novel.cover_image,
        gradient: novel.cover_gradient,
        accent: novel.cover_accent
      };
    }
    return novel;
  });
};

Yoru.getChapter = async function(novelId, chapterId) {
  const { data, error } = await Yoru.supabase
    .from('chapters')
    .select('*')
    .eq('novel_id', novelId)
    .eq('id', chapterId)
    .single();
    
  if (error || !data) return null;
  return data;
};

Yoru.getChapterIndex = function(novel, chapterId) {
  if (!novel || !novel.chapters) return -1;
  return novel.chapters.findIndex(function(ch) { return ch.id === chapterId; });
};

// Likes System
Yoru.toggleLike = async function(novelId) {
  const user = Yoru.auth.getUser();
  if (!user) return false;
  
  // Check if liked
  const { data: existing } = await Yoru.supabase
    .from('likes')
    .select('*')
    .eq('user_id', user.id)
    .eq('novel_id', novelId)
    .single();
    
  if (existing) {
    await Yoru.supabase.from('likes').delete().eq('id', existing.id);
    return false; // Unliked
  } else {
    await Yoru.supabase.from('likes').insert([{ user_id: user.id, novel_id: novelId }]);
    return true; // Liked
  }
};

Yoru.getLikeCount = async function(novelId) {
  const { count } = await Yoru.supabase
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('novel_id', novelId);
  return count || 0;
};

Yoru.hasUserLiked = async function(novelId) {
  const user = Yoru.auth.getUser();
  if (!user) return false;
  
  const { data } = await Yoru.supabase
    .from('likes')
    .select('id')
    .eq('user_id', user.id)
    .eq('novel_id', novelId)
    .single();
    
  return !!data;
};

Yoru.authors = ['Sawp', 'Hofuku', 'Kuuhaku'];

// ===== COVER GRADIENT THEMES =====
const coverThemes = {
  crimsonVeil: {
    gradient: 'linear-gradient(135deg, #110808 0%, #2a0a0a 50%, #4a1010 100%)',
    accent: 'rgba(196, 30, 58, 0.2)',
    image: 'assets/crimson_veil.jpg'
  },
  beneathSilk: {
    gradient: 'linear-gradient(135deg, #0a0505 0%, #1a0815 50%, #2d1024 100%)',
    accent: 'rgba(150, 40, 100, 0.2)',
    image: 'assets/beneath_silk.jpg'
  },
  obsidianChains: {
    gradient: 'linear-gradient(135deg, #050505 0%, #151515 50%, #252525 100%)',
    accent: 'rgba(255, 255, 255, 0.1)',
    image: 'assets/obsidian_chains.jpg'
  },
  hollowGarden: {
    gradient: 'linear-gradient(135deg, #050a05 0%, #0a1a0f 50%, #122c1b 100%)',
    accent: 'rgba(40, 120, 70, 0.15)',
    image: 'assets/hollow_garden.jpg'
  },
  voidBetween: {
    gradient: 'linear-gradient(135deg, #05050a 0%, #0c0e1c 50%, #151a30 100%)',
    accent: 'rgba(50, 70, 150, 0.2)',
    image: 'assets/void_between.jpg'
  },
  whiteNoise: {
    gradient: 'linear-gradient(135deg, #111 0%, #222 50%, #333 100%)',
    accent: 'rgba(200, 200, 200, 0.15)',
    image: 'assets/white_noise.jpg'
  },
  silentEmber: {
    gradient: 'linear-gradient(135deg, #0a0500 0%, #1a0d00 50%, #2d1800 100%)',
    accent: 'rgba(200, 100, 20, 0.15)',
    image: 'assets/silent_ember.jpg'
  }
};
window.coverThemes = coverThemes;
