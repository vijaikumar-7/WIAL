import { DirectoryClient } from "@/components/directory/DirectoryClient";
import { getCoaches, getCountryOptions, getLanguageOptions } from "@/lib/data";

export default function CoachesPage() {
  const coaches = getCoaches();
  const languageOptions = getLanguageOptions();
  const countryOptions = getCountryOptions();

  return (
    <div className="container-shell py-16">
      <div className="max-w-4xl space-y-4">
        <p className="kicker">Coach directory</p>
        <h1 className="section-title">Native global directory with honest public-data handling</h1>
        <p className="text-lg leading-8 text-[color:var(--muted-foreground)]">
          These records were imported from the provided public CSV export. The interface preserves
          source gaps instead of inventing certification levels or specialization tags.
        </p>
      </div>

      <div className="mt-10">
        <DirectoryClient
          coaches={coaches}
          languageOptions={languageOptions}
          countryOptions={countryOptions}
        />
      </div>
    </div>
  );
}
