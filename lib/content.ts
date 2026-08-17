// Local stand-in for Contentful entries until the space is populated.
// Shapes mirror the `post` content type (title / image / content) plus the
// extra fields each list needs (video URL, PDF link), so moving these into
// Contentful later is a matter of adding those fields and swapping the source.

export type VideoPost = {
  /** Also used as the #anchor on /listen. */
  slug: string;
  title: string;
  youtubeId: string;
  /** YouTube playlist ID; when set, the embed offers the rest of the list. */
  playlistId?: string;
  /** Optional link out to the playlist, with its label. */
  playlist?: { url: string; label: string };
  blurb: string;
};

export type TranscriptionPost = {
  slug: string;
  title: string;
  kind: "Transcription" | "Exercise";
  thumbnail: { src: string; width: number; height: number };
  pdf: string;
  blurb: string;
};

export const listenPosts: VideoPost[] = [
  {
    slug: "contact-nfa-2021",
    title: "Contact",
    youtubeId: "i_5XWr-6FWE",
    playlist: {
      url: "https://www.youtube.com/playlist?list=PLG5q2nYXK3373wXid9hQFhRi5B8-5sXc1",
      label: "More from this session",
    },
    blurb:
      "Flutist Haruna Fukazawa's original composition “Contact,” performed for the National Flute Association's 2021 convention.",
  },
  {
    slug: "everything-i-love",
    title: "Everything I Love",
    youtubeId: "hqVJDhQSbo8",
    playlistId: "OLAK5uy_mSmQ9booKJeXQEG6YONdywqHA9LaBCt_I",
    playlist: {
      url: "https://www.youtube.com/playlist?list=OLAK5uy_mSmQ9booKJeXQEG6YONdywqHA9LaBCt_I",
      label: "Listen to the full album",
    },
    blurb:
      "“From Osa,” from the trio recording Everything I Love with Paul Gill (bass) and Jason Tiemann (drums) — a program of standards and original compositions shaped by a contemporary approach to the jazz tradition.",
  },
];

export const album = {
  title: "Everything I Love",
  personnel: "with Paul Gill (bass) and Jason Tiemann (drums)",
  cover: { src: "/everything-i-love.jpg", width: 1000, height: 894 },
  /** Anchor on /listen for this album's post. */
  href: "/listen#everything-i-love",
  streaming: [
    {
      label: "Apple Music",
      url: "https://music.apple.com/us/album/everything-i-love-feat-paul-gill-jason-tiemann/6782251514",
    },
    {
      label: "Spotify",
      url: "https://open.spotify.com/album/1HP8QnOrpFUzGqXKzwDM7M",
    },
  ],
};

export const transcriptionPosts: TranscriptionPost[] = [
  {
    slug: "hazeltine-cedar-chord-cycle",
    title: "Hazeltine Cedar Chord Cycle",
    kind: "Exercise",
    thumbnail: {
      src: "/transcriptions/hazeltine-cedar-chord-cycle.jpg",
      width: 959,
      height: 1200,
    },
    pdf: "/transcriptions/hazeltine-cedar-chord-cycle.pdf",
    blurb:
      "A two-handed voicing exercise handed down from pianist David Hazeltine, built on Cedar Walton's ii–V vocabulary. Two pairs of voicings — m11 to 13(♭9), m9 to 7alt — cycle through every key, first as straight ii–Vs, then approached from a half-step above with major-seventh chords. Play it slowly and let the hands learn the shapes.",
  },
  {
    slug: "bouncin-with-bud",
    title: "Bouncin’ with Bud",
    kind: "Transcription",
    thumbnail: {
      src: "/transcriptions/bouncin-with-bud.jpg",
      width: 927,
      height: 1200,
    },
    pdf: "/transcriptions/bouncin-with-bud.pdf",
    blurb:
      "Bud Powell's solo on the master take of “Bouncin’ with Bud,” from the 1949 Blue Note session. Powell was the subject of DeMotta's doctoral research; this chorus is a compact study in his right-hand phrasing and left-hand punctuation.",
  },
  {
    slug: "nardis",
    title: "Nardis",
    kind: "Transcription",
    thumbnail: {
      src: "/transcriptions/nardis.jpg",
      width: 927,
      height: 1200,
    },
    pdf: "/transcriptions/nardis.pdf",
    blurb:
      "Bill Evans's solo on “Nardis” from Explorations (1961), with Scott LaFaro and Paul Motian — a piece Evans would return to for the rest of his career.",
  },
];

export const dissertation = {
  title: "The Contributions of Earl “Bud” Powell to the Modern Jazz Style",
  degree: "Ph.D. in Ethnomusicology",
  institution: "The Graduate Center, City University of New York",
  year: 2015,
  url: "https://academicworks.cuny.edu/cgi/viewcontent.cgi?article=1544&context=gc_etds",
  cover: { src: "/dissertation-cover.png", width: 695, height: 900 },
  description:
    "DeMotta's doctoral dissertation examines the pianist Earl “Bud” Powell's role in shaping the modern jazz style — his improvisational language, his rhythmic approach, and his influence on the generations of pianists who followed. Completed in 2015 at the CUNY Graduate Center, it is available in full through CUNY Academic Works.",
};

export const publications: {
  citation: string;
  kind: string;
  url?: string;
  linkLabel?: string;
}[] = [
  {
    citation:
      "DeMotta, David. “Bud Powell's Improvising and the Aesthetics of Bebop Rhythm.” Jazz Perspectives 12, no. 3 (2020): 339–370.",
    kind: "Peer-reviewed article",
    url: "https://doi.org/10.1080/17494060.2020.1840417",
    linkLabel: "doi:10.1080/17494060.2020.1840417",
  },
  {
    citation:
      "“Interlocking Riff Complexes in Big Band Mambo, Latin Jazz, and Swing Arrangements from the Early- to Mid-Twentieth Century.” Analytical Approaches to World Music Conference, University of Massachusetts Amherst.",
    kind: "Conference presentation",
  },
];

export const education = [
  {
    degree: "Ph.D. in Ethnomusicology",
    institution: "The Graduate Center, City University of New York",
    notes: [
      "Areas of specialization: Black Music of the Americas, Music of South Asia, jazz analysis and improvisation",
    ],
  },
  {
    degree: "M.M. in Jazz Studies and Performance (Piano)",
    institution: "William Paterson University",
    notes: [
      "Thesis: An Analysis of Herbie Hancock's Accompanying in The Miles Davis Quintet",
    ],
  },
  {
    degree: "B.A. in Jazz Studies and Performance (Piano)",
    institution: "William Paterson University",
    notes: ["Recipient of the Outstanding Senior Classical Performer Award"],
  },
];

export const about = {
  /** Short profile, used as the page lede. */
  lede: "David DeMotta is a jazz pianist, educator, and music scholar based in the New York City area. He maintains an active career as a performer, university instructor, and private teacher, with extensive experience teaching jazz performance, jazz history, music theory, world music, improvisation, and applied piano.",
  photos: [
    { src: "/about/photo-1.jpg", width: 800, height: 1200, alt: "David DeMotta smiling, hands resting on the open lid of a grand piano" },
    { src: "/about/photo-2.jpg", width: 528, height: 792, alt: "David DeMotta seated at a grand piano, laughing" },
    { src: "/about/photo-3.jpg", width: 528, height: 792, alt: "David DeMotta leaning on a grand piano, chin resting on his hand" },
  ],
  bio: [
    "David DeMotta performs regularly throughout the New York metropolitan area in solo, trio, and ensemble settings. His playing reflects a deep engagement with the bebop tradition, contemporary jazz piano, Brazilian music, and cross-cultural improvisational practices.",
    "His recent trio recording, Everything I Love, featuring bassist Paul Gill and drummer Jason Tiemann, presents a program of standards and original compositions shaped by a contemporary approach to the jazz tradition.",
    "As an educator, DeMotta has taught at Hunter College (CUNY), Montclair State University, William Paterson University, and Princeton University, in subjects ranging from jazz history and analysis to world music, the evolution of Black music in the Americas, and applied jazz piano. He also teaches privately from his home studio in Oradell, New Jersey.",
    "He holds a Ph.D. in Ethnomusicology from the CUNY Graduate Center, where his dissertation examined the contributions of Bud Powell to the modern jazz style; his research on Powell has appeared in Jazz Perspectives.",
  ],
  /** Press quotes/links go here once there are some; photos below. */
  pressPhotos: [
    { src: "/press/david-demotta-1.jpg", width: 1015, height: 677, alt: "David DeMotta at a grand piano, arms crossed" },
    { src: "/press/david-demotta-2.jpg", width: 528, height: 792, alt: "David DeMotta leaning on a grand piano, chin resting on his hand" },
    { src: "/press/david-demotta-4.jpg", width: 528, height: 792, alt: "David DeMotta seated at a grand piano, arms resting on a chair back" },
    { src: "/press/david-demotta-3.jpg", width: 1188, height: 792, alt: "David DeMotta in a suit and red tie in front of a grand piano" },
  ],
  appointments: [
    {
      institution: "Hunter College, CUNY",
      role: "Adjunct Assistant Professor",
      years: "2012–Present",
      courses: [
        "Music Theory Fundamentals",
        "History of Jazz",
        "World Music",
        "Evolution of Black Music in the Americas",
        "Jazz and Popular Music Combos",
        "Hunter Jazz Ensemble",
        "Private Piano Instruction",
      ],
    },
    {
      institution: "Montclair State University",
      role: "Adjunct Professor of Music",
      years: "2022–Present",
      courses: [
        "Introduction to Jazz",
        "Diverse Worlds of Music",
        "Jazz Performance Practicum",
        "Graduate Seminar in Historical and Theoretical Studies",
        "Private Instruction in Jazz Piano and Improvisation",
      ],
    },
    {
      institution: "William Paterson University",
      role: "Adjunct Professor",
      years: "2017–2022",
      courses: [
        "Jazz History and Analysis I & II",
        "Music Theory Fundamentals",
        "Understanding Jazz: History and Appreciation",
      ],
    },
    {
      institution: "Princeton University",
      role: "Lecturer",
      years: "2012",
      courses: ["Introduction to the Evolution of Jazz Styles"],
    },
  ],
};
