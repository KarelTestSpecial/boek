import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_DIRS = {
    'nl': path.resolve(__dirname, '../02-LIVE/01-Nederlands'),
    'en': path.resolve(__dirname, '../02-LIVE/02-English')
};

const OUTPUT_FILE = path.resolve(__dirname, './src/data/book.json');

function cleanTitle(title) {
    // Remove numbering like H01_ or 01_
    return title
        .replace(/^H\d+[-_]/, '')  // Matches H01_ or H01-
        .replace(/^\d+[-_]/, '')   // Matches 01_ or 01-
        .replace(/\.md$/, '')      // Remove .md
        .replace(/[-_]/g, ' ')     // Replace dashes and underscores with spaces
        .trim();
}

function getSections(manuscriptDir) {
    if (!fs.existsSync(manuscriptDir)) {
        console.warn(`Directory not found: ${manuscriptDir}`);
        return [];
    }

    const sections = [];
    const entries = fs.readdirSync(manuscriptDir).filter(f => fs.statSync(path.join(manuscriptDir, f)).isDirectory());

    // Sort folders by number
    entries.sort((a, b) => {
        const getNum = (s) => {
            const match = s.match(/\d+/);
            return match ? parseInt(match[0]) : 999;
        };
        return getNum(a) - getNum(b);
    }).forEach(dir => {
        const sectionPath = path.join(manuscriptDir, dir);
        const files = fs.readdirSync(sectionPath).filter(f => f.endsWith('.md'));

        const chapters = [];
        files.sort().forEach(file => {
            const filePath = path.join(sectionPath, file);
            const content = fs.readFileSync(filePath, 'utf-8');

            chapters.push({
                id: `${dir}/${file}`,
                title: cleanTitle(file),
                content: content.trim()
            });
        });

        sections.push({
            id: dir,
            title: cleanTitle(dir),
            chapters: chapters
        });
    });

    return sections;
}

const multiBookData = {};

for (const [key, dir] of Object.entries(BASE_DIRS)) {
    console.log(`Processing ${key} from ${dir}...`);
    multiBookData[key] = {
        title: key === 'nl' ? "De Vrije Realiteit" : "Free-ality",
        subtitle: key.startsWith('en') ? "The Path to Convergence" : "De Weg naar Convergentie",
        author: "Karel",
        sections: getSections(dir)
    };
}

const outputDir = path.dirname(OUTPUT_FILE);
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(multiBookData, null, 2));
console.log('Multi-book data generated successfully at', OUTPUT_FILE);
