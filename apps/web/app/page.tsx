"use client";

import { useState, useMemo } from "react";
import { useQuery, gql } from "@apollo/client";
import { SnippetList } from "@/components/snippet-list";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";

const SNIPPETS_QUERY = gql`
  query Snippets {
    snippets {
      id
      title
      description
      language
      createdAt
      author {
        email
      }
    }
  }
`;
export default function Home() {
  const { data, loading, error } = useQuery(SNIPPETS_QUERY);

  const snippets = useMemo(
    () => data?.snippets || [],
    [data]
  );

  // Extract unique languages and tags from approved snippets only
  const languages = useMemo(
    () => Array.from(new Set(snippets.map((s: any) => s.language))),
    [snippets]
  );
  const tags = useMemo(
    () => Array.from(new Set(snippets.flatMap((s: any) => s.tags || []))),
    [snippets]
  );

  const [selectedLanguage, setSelectedLanguage] = useState<string>("All");
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [search, setSearch] = useState<string>("");

  // Filter snippets based on language, tag, and search
  const filteredSnippets = useMemo(() => {
    if (
      (selectedLanguage === "All" || !selectedLanguage) &&
      (selectedTag === "All" || !selectedTag) &&
      !search
    ) {
      return snippets;
    }
    return snippets.filter(
      (s: any) =>
        (selectedLanguage === "All" || s.language === selectedLanguage) &&
        (selectedTag === "All" || (s.tags || []).includes(selectedTag)) &&
        (s.title.toLowerCase().includes(search.toLowerCase()) ||
          s.description.toLowerCase().includes(search.toLowerCase()) ||
          s.language.toLowerCase().includes(search.toLowerCase()) ||
          (s.tags || []).some((tag: string) =>
            tag.toLowerCase().includes(search.toLowerCase())
          ))
    );
  }, [snippets, selectedLanguage, selectedTag, search]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <main className="container mx-auto px-4 py-8">
        <section className="grid grid-cols-1 gap-6 md:grid-cols-4 mb-8">
          <div className="bg-card rounded-lg shadow p-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Total Snippets
            </h3>
            <p className="text-3xl font-bold">{snippets.length}</p>
            <p className="text-xs text-muted-foreground">
              Approved code snippets
            </p>
          </div>
          <div className="bg-card rounded-lg shadow p-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Languages
            </h3>
            <p className="text-3xl font-bold">{languages.length}</p>
            <p className="text-xs text-muted-foreground">
              Programming languages covered
            </p>
          </div>
          <div className="bg-card rounded-lg shadow p-4">
            <h3 className="text-sm font-medium text-muted-foreground">Tags</h3>
            <p className="text-3xl font-bold">{tags.length}</p>
            <p className="text-xs text-muted-foreground">Tags covered</p>
          </div>
          <div className="bg-card rounded-lg shadow p-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              This Week
            </h3>
            <p className="text-3xl font-bold">0</p>
            <p className="text-xs text-muted-foreground">New snippets added</p>
          </div>
        </section>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="relative w-full md:max-w-md">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search approved snippets, languages, or tags..."
              className="w-full pl-10 pr-4 py-2 rounded-md border border-input bg-background"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <div className="flex gap-3">
            <select
              className="rounded-md border border-input bg-background px-3 py-2"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              <option value="All">All Languages</option>
              {languages.map((language, index) => (
                <option key={index} value={String(language)}>
                  {String(language)}
                </option>
              ))}
            </select>
            <select
              className="rounded-md border border-input bg-background px-3 py-2"
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
            >
              <option value="All">All Tags</option>
              {tags.map((tag, index) => (
                <option key={index} value={String(tag)}>
                  {String(tag)}
                </option>
              ))}
            </select>
          </div>
        </div>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading snippets...
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            Failed to load snippets.
          </div>
        ) : (
          <SnippetList snippets={filteredSnippets} />
        )}
      </main>
    </div>
  );
}
