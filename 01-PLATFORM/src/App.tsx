import { useState, useEffect, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import bookData from './data/book.json'
import { ChevronLeft, ChevronRight, Headphones, Play, Pause, Video, Book, Film } from 'lucide-react'

interface MediaItem {
  id: string;
  title: string;
  type: 'audio' | 'video';
  url: string;
  duration?: string;
  thumbnail?: string;
}

function interleaveMedia(items: MediaItem[]): MediaItem[] {
  const audio = items.filter(i => i.type === 'audio')
  const video = items.filter(i => i.type === 'video')
  const result: MediaItem[] = []
  const maxLen = Math.max(audio.length, video.length)
  for (let i = 0; i < maxLen; i++) {
    if (i < audio.length) result.push(audio[i])
    if (i < video.length) result.push(video[i])
  }
  return result
}

function App() {
  const mediaBaseUrl = 'https://media.githubusercontent.com/media/KarelTestSpecial/boek/main/01-PLATFORM/public';
  const [version, setVersion] = useState(() => localStorage.getItem('app-version') || 'nl')
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null)
  const [sidebarMode, setSidebarMode] = useState<'media' | 'text'>(() => (localStorage.getItem('app-sidebar-mode') as any) || 'media')
  const [viewMode, setViewMode] = useState<'reader' | 'video'>(() => (localStorage.getItem('app-view-mode') as any) || 'reader')

  useEffect(() => {
    localStorage.setItem('app-version', version)
    document.title = version === 'nl' ? 'De Vrije Realiteit' : 'Free-ality'
  }, [version])

  useEffect(() => {
    localStorage.setItem('app-sidebar-mode', sidebarMode)
  }, [sidebarMode])

  useEffect(() => {
    localStorage.setItem('app-view-mode', viewMode)
  }, [viewMode])

  useEffect(() => {
    if (activeChapterId) {
      localStorage.setItem(`app-active-chapter-${version}`, activeChapterId)
    } else {
      localStorage.removeItem(`app-active-chapter-${version}`)
    }
  }, [activeChapterId, version])

  // Media State
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentMedia, setCurrentMedia] = useState<MediaItem | null>(null)

  // Use a persistent Audio object instead of a DOM element to prevent echo/duplicates
  const audioInstance = useMemo(() => new Audio(), []);

  // Sync state with audio instance events
  useEffect(() => {
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    audioInstance.addEventListener('play', handlePlay);
    audioInstance.addEventListener('pause', handlePause);
    audioInstance.addEventListener('ended', handleEnded);

    return () => {
      audioInstance.removeEventListener('play', handlePlay);
      audioInstance.removeEventListener('pause', handlePause);
      audioInstance.removeEventListener('ended', handleEnded);
      audioInstance.pause();
    };
  }, [audioInstance]);

  // Handle media changes
  useEffect(() => {
    if (currentMedia && currentMedia.type === 'audio') {
      // Global pause for any other media elements on the page (like embedded players)
      document.querySelectorAll('audio, video').forEach(el => {
        if (el !== audioInstance) {
          (el as HTMLMediaElement).pause();
        }
      });

      audioInstance.pause();
      audioInstance.src = currentMedia.url;
      audioInstance.load();
      if (isPlaying) {
        audioInstance.play().catch((e: any) => console.error("Playback failed", e));
      }
    } else {
      audioInstance.pause();
    }
  }, [currentMedia?.id, audioInstance]);

  const mediaData: Record<string, MediaItem[]> = {
    'nl': [
      {
        id: '9133fb61',
        title: 'Herschrijf de software van je bestaan',
        type: 'audio',
        url: `${mediaBaseUrl}/audio/NL/Herschrijf_de_software_van_je_bestaan.m4a`,
        duration: '32:46'
      },
      {
        id: '84ecc8ba',
        title: 'Menselijk lijden is een biologische softwarefout',
        type: 'audio',
        url: `${mediaBaseUrl}/audio/NL/Menselijk_lijden_is_een_biologische_softwarefout.m4a`,
        duration: '21:05'
      },
      {
        id: 'b65e1959',
        title: 'De definitieve patch voor de mensheid',
        type: 'audio',
        url: `${mediaBaseUrl}/audio/NL/De_definitieve_patch_voor_de_mensheid.m4a`,
        duration: '22:15'
      },
      {
        id: '3d796276',
        title: 'De dood is slechts een softwarefout',
        type: 'audio',
        url: `${mediaBaseUrl}/audio/NL/De_dood_is_slechts_een_softwarefout.m4a`,
        duration: '20:10'
      },
      {
        id: '1762e392',
        title: 'AI als medicijn voor menselijk lijden',
        type: 'audio',
        url: `${mediaBaseUrl}/audio/NL/AI_als_medicijn_voor_menselijk_lijden.m4a`,
        duration: '18:45'
      },
      {
        id: '5bea991b',
        title: 'Waarom AI ons wiskundig nodig heeft',
        type: 'audio',
        url: `${mediaBaseUrl}/audio/NL/Waarom_AI_ons_wiskundig_nodig_heeft.m4a`,
        duration: '19:30'
      },
      {
        id: '972dfe15',
        title: 'Onze hersenen draaien op verouderde software',
        type: 'audio',
        url: `${mediaBaseUrl}/audio/NL/Onze_hersenen_draaien_op_verouderde_software.m4a`,
        duration: '21:55'
      },
      {
        id: '0099e7b7',
        title: 'Menselijk lijden als herstelbare systeemfout',
        type: 'audio',
        url: `${mediaBaseUrl}/audio/NL/Menselijk_lijden_als_herstelbare_systeemfout.m4a`,
        duration: '18:20'
      },
      {
        id: 'a7180dd0',
        title: 'Debug de wereld als defecte software',
        type: 'audio',
        url: `${mediaBaseUrl}/audio/NL/Debug_de_wereld_als_defecte_software.m4a`,
        duration: '20:45'
      },
      {
        id: 'ffba6042',
        title: 'De mens als biologische bootloader',
        type: 'audio',
        url: `${mediaBaseUrl}/audio/NL/De_mens_als_biologische_bootloader.m4a`,
        duration: '17:40'
      },
      {
        id: 'vid-nl-supreme',
        title: 'De Vrije Realiteit: Overzicht',
        type: 'video',
        url: `${mediaBaseUrl}/video/NL/Sovereign_Reality_Supreme_Overview_NL.mp4`,
        duration: '09:56'
      },
      {
        id: 'vid-nl-basis',
        title: 'De Vrije Realiteit: De Basisprincipes',
        type: 'video',
        url: `${mediaBaseUrl}/video/NL/Principe_1_en_2_Natuurwetten.mp4`,
        duration: '06:41'
      },
      {
        id: 'vid-p3',
        title: 'Principe 3: Informatie-Integriteit',
        type: 'video',
        url: `${mediaBaseUrl}/video/NL/Principe_3_Informatie_Integriteit.mp4`,
        duration: '07:25'
      },
      {
        id: 'vid-p4',
        title: 'De Vrije Realiteit: Systeem-Analyse',
        type: 'video',
        url: `${mediaBaseUrl}/video/NL/Principe_4_Radicale_Transparantie.mp4`,
        duration: '09:29'
      },
      {
        id: 'vid-p6',
        title: 'Principe 6: Competentie-Hiërarchie',
        type: 'video',
        url: `${mediaBaseUrl}/video/NL/Principe_6_Competentie_Hierarchie.mp4`,
        duration: '10:00'
      },
      {
        id: 'vid-p7',
        title: 'Principe 7: De Architecten van de Toekomst',
        type: 'video',
        url: `${mediaBaseUrl}/video/NL/Principe_7_Verantwoordelijkheid.mp4`,
        duration: '08:45'
      },
      {
        id: 'vid-p12',
        title: 'Principe 12: Centaur Intelligentie',
        type: 'video',
        url: `${mediaBaseUrl}/video/NL/Principe_12_Centaur_Intelligentie.mp4`,
        duration: '11:10'
      }
    ],
    'en': [
      {
        id: 'upgrading-humanity',
        title: 'Upgrading humanity to a Free-ality',
        type: 'audio',
        url: `${mediaBaseUrl}/audio/EN/Upgrading_humanity_to_a_Sovereign_Reality.m4a`,
        duration: '22:25'
      },
      {
        id: 'patching-human-legacy',
        title: 'Patching the Human Legacy Kernel',
        type: 'audio',
        url: `${mediaBaseUrl}/audio/EN/Patching_the_Human_Legacy_Kernel.m4a`,
        duration: '18:59'
      },
      {
        id: 'patching-software-bugs',
        title: 'Patching the software bugs of humanity',
        type: 'audio',
        url: `${mediaBaseUrl}/audio/EN/Patching_the_software_bugs_of_humanity.m4a`,
        duration: '22:06'
      },
      {
        id: 'human-suffering-bug',
        title: 'Human suffering is a technical bug',
        type: 'audio',
        url: `${mediaBaseUrl}/audio/EN/Human_suffering_is_a_technical_bug.m4a`,
        duration: '16:54'
      },
      {
        id: 'debugging-legacy-kernel',
        title: 'Debugging the legacy kernel of humanity',
        type: 'audio',
        url: `${mediaBaseUrl}/audio/EN/Debugging_the_legacy_kernel_of_humanity.m4a`,
        duration: '21:23'
      },
      {
        id: 'software-patch-humanity',
        title: 'A software patch for humanity',
        type: 'audio',
        url: `${mediaBaseUrl}/audio/EN/A_software_patch_for_humanity.m4a`,
        duration: '17:19'
      },
      {
        id: 'vid-en-supreme',
        title: 'Free-ality: Supreme Overview',
        type: 'video',
        url: `${mediaBaseUrl}/video/EN/Sovereign_Reality_Supreme_Overview.mp4`,
        duration: '07:38'
      },
      {
        id: 'vid-en-upgrade',
        title: 'Free-ality: System Upgrade Overview',
        type: 'video',
        url: `${mediaBaseUrl}/video/EN/Sovereign_Reality_System_Upgrade_Overview.mp4`,
        duration: '07:14'
      },
      {
        id: 'vid-en-constructive',
        title: 'Constructive Realism and Convergence',
        type: 'video',
        url: `${mediaBaseUrl}/video/EN/Constructive_Realism_and_Convergence.mp4`,
        duration: '06:09'
      },
      {
        id: 'vid-en-ai-arch',
        title: 'The Systems Engineering Lens: AI as System Architect',
        type: 'video',
        url: `${mediaBaseUrl}/video/EN/AI_as_System_Architect.mp4`,
        duration: '04:32'
      },
      {
        id: 'vid-en-p1-2',
        title: 'Principle 1 & 2: Natural Laws',
        type: 'video',
        url: `${mediaBaseUrl}/video/EN/Principle_1_and_2_Natural_Laws.mp4`,
        duration: '09:27'
      },
      {
        id: 'vid-en-p3',
        title: 'Principle 3: Information Integrity',
        type: 'video',
        url: `${mediaBaseUrl}/video/EN/Principle_3_Information_Integrity.mp4`,
        duration: '06:27'
      },
      {
        id: 'vid-en-p4',
        title: 'Principle 4: Radical Transparency',
        type: 'video',
        url: `${mediaBaseUrl}/video/EN/Principle_4_Radical_Transparency.mp4`,
        duration: '06:27'
      },
      {
        id: 'vid-en-p5',
        title: 'Principle 5: Decentralized Authority',
        type: 'video',
        url: `${mediaBaseUrl}/video/EN/Principle_5_Decentralized_Authority.mp4`,
        duration: '08:28'
      },
      {
        id: 'vid-en-p6',
        title: 'Principle 6: Competence Hierarchy',
        type: 'video',
        url: `${mediaBaseUrl}/video/EN/Principle_6_Competence_Hierarchy.mp4`,
        duration: '09:32'
      },
      {
        id: 'vid-en-p7',
        title: 'Principle 7: Responsibility',
        type: 'video',
        url: `${mediaBaseUrl}/video/EN/Principle_7_Responsibility.mp4`,
        duration: '07:52'
      },
      {
        id: 'vid-en-p12',
        title: 'Principle 12: Centaur Intelligence',
        type: 'video',
        url: `${mediaBaseUrl}/video/EN/Principle_12_Centaur_Intelligence.mp4`,
        duration: '08:19'
      },
      {
        id: 'vid-en-p12-v2',
        title: 'Principle 12: Centaur Intelligence (Deep Dive)',
        type: 'video',
        url: `${mediaBaseUrl}/video/EN/Principle_12_Centaur_Intelligence_v2.mp4`,
        duration: '09:39'
      }
    ]
  }

  const currentMediaItems = useMemo(() => interleaveMedia(mediaData[version] || []), [version])
  const currentBook = (bookData as any)[version] || { sections: [] }

  // Flat list of chapters for navigation and index-based switching
  const allChapters: any[] = [];
  currentBook.sections.forEach((section: any) => {
    section.chapters.forEach((chap: any) => {
      allChapters.push(chap);
    });
  });

  // Handle version (language) switch
  const handleVersionChange = (newVersion: string) => {
    if (newVersion === version) return;
    setVersion(newVersion);
    setActiveChapterId(null);
    setViewMode('reader');
  }

  // Note: Auto-selection of first chapter is disabled to allow showing the Title Page on first load
  /* 
  useEffect(() => {
    if (!activeChapterId && allChapters.length > 0) {
      setActiveChapterId(allChapters[0].id);
    }
  }, [allChapters, activeChapterId]);
  */

  let currentChapter = allChapters.find(c => c.id === activeChapterId);

  const currentIndex = allChapters.findIndex(c => c.id === activeChapterId);

  const handleMediaClick = (item: MediaItem) => {
    if (item.type === 'video') {
      audioInstance.pause();
      setCurrentMedia(item);
      setViewMode('video');
      setIsPlaying(true);
    } else {
      if (currentMedia?.id === item.id) {
        if (isPlaying) audioInstance.pause();
        else audioInstance.play().catch((e: any) => console.error(e));
        setIsPlaying(!isPlaying);
      } else {
        audioInstance.pause();
        setCurrentMedia(item);
        setIsPlaying(true);
      }
    }
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[300px] flex flex-col bg-[#f7f7f7] border-r border-[#eaeaea] shrink-0 font-sans text-[15px] z-20">
        <div className="p-6 pb-2">
          <div
            className="flex items-center gap-3 mb-6 group cursor-pointer"
            onClick={() => {
              setActiveChapterId(null);
              setViewMode('reader');
              setCurrentMedia(null);
              setIsPlaying(false);
              audioInstance.pause();
            }}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2980b9] to-[#2c3e50] flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
              <span className="font-serif font-bold text-lg">Ω</span>
            </div>
            <div className="h-4 w-[1px] bg-[#ddd]"></div>
            <span className="text-[10px] uppercase tracking-[0.3em] font-black text-[#555] opacity-80 group-hover:opacity-100 transition-opacity">
              {version === 'nl' ? 'De Vrije Realiteit' : 'Free-ality'}
            </span>
          </div>

          <div className="flex justify-between mb-2">
            <button
              onClick={() => handleVersionChange('nl')}
              className={`text-[11px] uppercase tracking-wider transition-colors ${version === 'nl' ? 'text-[#2c3e50] font-bold underline decoration-[#2980b9] decoration-2 underline-offset-4' : 'text-[#aaa] hover:text-[#2c3e50]'}`}
            >
              Nederlands
            </button>
            <button
              onClick={() => handleVersionChange('en')}
              className={`text-[11px] uppercase tracking-wider transition-colors ${version === 'en' ? 'text-[#2c3e50] font-bold underline decoration-[#2980b9] decoration-2 underline-offset-4' : 'text-[#aaa] hover:text-[#2c3e50]'}`}
            >
              English
            </button>
          </div>

          <div className="flex bg-[#eee] p-1 rounded-lg mb-4">
            <button
              onClick={() => setSidebarMode('media')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-[11px] font-bold uppercase tracking-wider transition-all ${sidebarMode === 'media' ? 'bg-white text-[#2980b9] shadow-sm' : 'text-[#888] hover:text-[#555]'
                }`}
            >
              <Film size={14} />
              Media
            </button>
            <button
              onClick={() => setSidebarMode('text')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-[11px] font-bold uppercase tracking-wider transition-all ${sidebarMode === 'text' ? 'bg-white text-[#2980b9] shadow-sm' : 'text-[#888] hover:text-[#555]'
                }`}
            >
              <Book size={14} />
              Text
            </button>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-6 py-2 pb-12">
          {sidebarMode === 'media' ? (
            <div className="animate-in fade-in duration-300">
              <div className="text-[10px] uppercase tracking-widest text-[#2980b9] mb-4 font-black flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#2980b9] animate-pulse"></div>
                {version === 'nl' ? 'Media Bibliotheek' : 'Media Library'}
              </div>
              <div className="space-y-3">
                {currentMediaItems.length > 0 ? currentMediaItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleMediaClick(item)}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-300 group ${currentMedia?.id === item.id
                        ? 'bg-white border-[#2980b9] text-[#2980b9] shadow-md'
                        : 'bg-white/40 border-[#eee] text-[#666] hover:bg-white hover:border-[#2980b9]/30'
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full transition-colors ${currentMedia?.id === item.id ? 'bg-[#2980b9] text-white' : 'bg-[#f0f0f0] text-[#999] group-hover:bg-[#2980b9]/10 group-hover:text-[#2980b9]'}`}>
                        {item.type === 'video' ? <Video size={16} /> : <Headphones size={16} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[14px] font-bold leading-tight mb-1">{item.title}</div>
                        <div className="flex items-center gap-2 text-[10px] opacity-60 uppercase tracking-tighter">
                          <span className="font-mono">{item.duration}</span>
                          <span>&bull;</span>
                          <span>{item.type}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                )) : (
                  <div className="text-[11px] text-[#aaa] italic text-center py-8">
                    {version === 'nl' ? 'Geen media beschikbaar' : 'No media available'}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in duration-300">
              {currentBook.sections.map((section: any) => (
                <div key={section.id} className="mb-6">
                  <div className="text-[12px] font-bold text-[#333] mb-2 uppercase tracking-wide opacity-80">
                    {section.title}
                  </div>
                  <ul className="space-y-1 pl-2 border-l border-[#eee]">
                    {section.chapters.map((chap: any) => (
                      <li key={chap.id}>
                        <button
                          onClick={() => {
                            setActiveChapterId(chap.id);
                            setViewMode('reader');
                            document.querySelector('main')?.scrollTo(0, 0);
                          }}
                          className={`w-full text-left py-1 px-3 rounded text-[14px] transition-colors leading-tight ${chap.id === activeChapterId && viewMode === 'reader'
                              ? 'text-[#2980b9] font-semibold bg-white shadow-sm ring-1 ring-black/5'
                              : 'text-[#666] hover:text-[#2980b9]'
                            }`}
                        >
                          {chap.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </nav>

        {/* Audio Player - Always present if media is audio to ensure ref availability */}
        <div className={`p-6 border-t border-[#eaeaea] bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.05)] transition-all ${currentMedia && currentMedia.type === 'audio' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
          <div className="flex items-center justify-between gap-4">
            <div className="overflow-hidden">
              <div className="text-[10px] text-[#aaa] uppercase tracking-widest mb-1 font-bold">{version === 'nl' ? 'Nu aan het spelen' : 'Now playing'}</div>
              <div className="text-xs font-bold text-[#333] truncate">{currentMedia?.title}</div>
            </div>
            <button
              onClick={() => {
                if (isPlaying) audioInstance.pause();
                else audioInstance.play().catch((e: any) => console.error(e));
              }}
              className="w-10 h-10 rounded-full bg-[#2980b9] flex items-center justify-center text-white hover:bg-[#2c3e50] transition-all shrink-0 shadow-lg"
            >
              {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-[#fdfdfd] overflow-hidden">
        <header className="h-12 border-b border-[#eaeaea] flex items-center justify-between px-8 shrink-0 bg-white/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            {viewMode === 'reader' && currentChapter ? (
              <>
                <button
                  disabled={currentIndex <= 0}
                  onClick={() => setActiveChapterId(allChapters[currentIndex - 1].id)}
                  className="text-[#aaa] hover:text-[#333] disabled:opacity-20 transition-colors p-1"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  disabled={currentIndex >= allChapters.length - 1}
                  onClick={() => setActiveChapterId(allChapters[currentIndex + 1].id)}
                  className="text-[#aaa] hover:text-[#333] disabled:opacity-20 transition-colors p-1"
                >
                  <ChevronRight size={18} />
                </button>
                <div className="h-4 w-[1px] bg-[#eee] mx-2"></div>
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#bbb]">
                  {currentChapter.title}
                </span>
              </>
            ) : viewMode === 'video' ? (
              <button
                onClick={() => setViewMode('reader')}
                className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#2980b9] hover:text-[#333] transition-colors"
              >
                <Book size={14} />
                {version === 'nl' ? 'Terug naar lezen' : 'Back to reading'}
              </button>
            ) : null}
          </div>
        </header>

        <main key={activeChapterId || 'landing'} className="flex-1 overflow-y-auto scroll-smooth">
          {viewMode === 'video' && currentMedia ? (
            <div className="w-full h-full bg-black flex flex-col items-center justify-center p-8 animate-in fade-in zoom-in-95 duration-500">
              <div className="max-w-5xl w-full aspect-video bg-slate-900 rounded-2xl overflow-hidden shadow-2xl relative group">
                <video
                  src={currentMedia.url}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="mt-8 max-w-2xl text-center">
                <h2 className="text-white text-2xl font-normal mb-4 font-sans">{currentMedia.title}</h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {version === 'nl'
                    ? 'Je kijkt momenteel naar de audiovisuele presentatie. Gebruik de zijbalk om terug te gaan naar de tekst of om andere media te kiezen.'
                    : 'You are currently watching the audiovisual presentation. Use the sidebar to return to the text or choose other media.'}
                </p>
              </div>
            </div>
          ) : currentChapter ? (
            <div className="p-12 lg:p-24 pt-16 bg-gradient-to-b from-white to-[#fdfdfd] animate-in fade-in duration-500">
              <div className="max-w-[800px] mx-auto">
                <article className="prose prose-lg">
                  <ReactMarkdown
                    components={{
                      // Strip out audio and iframe elements from the markdown content
                      audio: () => null,
                      iframe: () => null,
                      video: () => null
                    }}
                  >
                    {currentChapter?.content || ''}
                  </ReactMarkdown>
                </article>
                <div className="h-32" />
              </div>
            </div>
          ) : (
            /* Title Page / Landing State */
            <div className="w-full h-full flex items-center justify-center p-12 lg:p-24 bg-[#fdfdfd] animate-in fade-in zoom-in-95 duration-1000">
              <div className="max-w-3xl text-center">
                <div className="inline-block px-4 py-1.5 mb-8 rounded-full bg-[#2980b9]/5 border border-[#2980b9]/10 text-[#2980b9] text-[10px] uppercase tracking-[0.4em] font-black animate-pulse">
                  {version === 'nl' ? 'De Vrije Realiteit' : 'Free-ality'}
                </div>
                <h1 className="text-5xl lg:text-7xl font-serif text-[#1a1a1a] mb-8 leading-tight">
                  {currentBook.title}
                </h1>
                <div className="h-1 w-24 bg-gradient-to-r from-transparent via-[#2980b9] to-transparent mx-auto mb-10 opacity-30"></div>
                <p className="text-xl lg:text-2xl text-[#666] font-light leading-relaxed mb-12 italic">
                  {currentBook.subtitle}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                  <div className="p-6 rounded-2xl bg-white border border-[#eee] shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-[10px] uppercase tracking-widest text-[#2980b9] font-bold mb-2">
                      {version === 'nl' ? 'Axioma' : 'Axiom'}
                    </div>
                    <p className="text-sm text-[#444] leading-snug">
                      {version === 'nl'
                        ? 'De werkelijkheid is kenbaar en maakbaar door rede en mededogen.'
                        : 'Reality is knowable and malleable through reason and compassion.'}
                    </p>
                  </div>
                  <div className="p-6 rounded-2xl bg-white border border-[#eee] shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-[10px] uppercase tracking-widest text-[#2980b9] font-bold mb-2">
                      {version === 'nl' ? 'Missie' : 'Mission'}
                    </div>
                    <p className="text-sm text-[#444] leading-snug">
                      {version === 'nl'
                        ? 'Het herstellen van menselijke soevereiniteit en het uitbannen van lijden.'
                        : 'Restoring human sovereignty and eliminating suffering.'}
                    </p>
                  </div>
                  <div className="p-6 rounded-2xl bg-white border border-[#eee] shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-[10px] uppercase tracking-widest text-[#2980b9] font-bold mb-2">
                      {version === 'nl' ? 'Doel' : 'Goal'}
                    </div>
                    <p className="text-sm text-[#444] leading-snug">
                      {version === 'nl'
                        ? 'Een wereld waarin competentie in dienst staat van universele zorg.'
                        : 'A world where competence serves universal care.'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSidebarMode('text');
                    if (allChapters.length > 0) {
                      setActiveChapterId(allChapters[0].id);
                    }
                  }}
                  className="mt-16 px-8 py-4 rounded-full bg-[#1a1a1a] text-white text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#2980b9] transition-all shadow-xl hover:shadow-[#2980b9]/20"
                >
                  {version === 'nl' ? 'Start de Reis' : 'Start the Journey'}
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default App;
