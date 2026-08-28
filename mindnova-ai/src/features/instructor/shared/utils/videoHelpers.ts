export function getEmbedUrl(url: string): string | null {
 if (!url) return null;

 try {
 const urlObj = new URL(url);
 const hostname = urlObj.hostname.toLowerCase();

 // YouTube
 if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
 let videoId = '';
 if (hostname.includes('youtu.be')) {
 videoId = urlObj.pathname.slice(1);
 } else {
 videoId = urlObj.searchParams.get('v') || '';
 }
 if (videoId) {
 return `https://www.youtube.com/embed/${videoId}`;
 }
 }

 // Vimeo
 if (hostname.includes('vimeo.com')) {
 const videoId = urlObj.pathname.split('/').pop();
 if (videoId && !isNaN(Number(videoId))) {
 return `https://player.vimeo.com/video/${videoId}`;
 }
 }

 // Default: Not a known embeddable platform, return null to fallback to <video>
 return null;
 } catch (e) {
 return null;
 }
}