import { useEffect, useMemo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Link } from "wouter";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import type { Project } from "../data/projects";

const C = {
  dark: "#21141A",
  teal: "#8CB2C0",
  wine: "#683D47",
  light: "#FFFBF0",
  parchment: "#F5F3ED",
  muted: "#7a7a7a",
};

type ProjectsMapProps = {
  projects: Project[];
  selectedSlug?: string | null;
  onSelect?: (slug: string) => void;
  height?: number | string;
};

function formatPinPrice(priceFrom: string) {
  return priceFrom
    .replace(/^From\s+/i, "")
    .replace(/,000\b/g, "k");
}

function createPinIcon(project: Project, isSelected: boolean) {
  const className = isSelected ? "project-map-pin project-map-pin-selected" : "project-map-pin";

  return L.divIcon({
    className: "project-map-pin-wrapper",
    html: `
      <div class="${className}">
        <span>${formatPinPrice(project.priceFrom)}</span>
      </div>
    `,
    iconSize: [76, 36],
    iconAnchor: [38, 32],
    popupAnchor: [0, -30],
  });
}

function FitBounds({ projects }: { projects: Project[] }) {
  const map = useMap();
  const boundsKey = projects.map((project) => project.slug).join("|");

  useEffect(() => {
    if (!projects.length) return;

    if (projects.length === 1) {
      map.setView([projects[0].lat, projects[0].lng], 13, { animate: true });
      return;
    }

    const bounds = L.latLngBounds(projects.map((project) => [project.lat, project.lng]));
    map.fitBounds(bounds, { padding: [44, 44], maxZoom: 13, animate: true });
  }, [boundsKey, map, projects]);

  return null;
}

function FlyToSelected({ projects, selectedSlug }: { projects: Project[]; selectedSlug?: string | null }) {
  const map = useMap();

  useEffect(() => {
    if (!selectedSlug) return;

    const selectedProject = projects.find((project) => project.slug === selectedSlug);
    if (!selectedProject) return;

    map.flyTo([selectedProject.lat, selectedProject.lng], Math.max(map.getZoom(), 13), {
      duration: 0.7,
    });
  }, [map, projects, selectedSlug]);

  return null;
}

export function ProjectsMap({ projects, selectedSlug, onSelect, height = 620 }: ProjectsMapProps) {
  const center = useMemo<[number, number]>(() => {
    if (!projects.length) return [41.642237, 41.624679];

    const totals = projects.reduce(
      (acc, project) => ({ lat: acc.lat + project.lat, lng: acc.lng + project.lng }),
      { lat: 0, lng: 0 },
    );

    return [totals.lat / projects.length, totals.lng / projects.length];
  }, [projects]);

  return (
    <div className="project-map-shell" style={{ height }}>
      <MapContainer center={center} zoom={11} scrollWheelZoom className="project-map-leaflet">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds projects={projects} />
        <FlyToSelected projects={projects} selectedSlug={selectedSlug} />

        {projects.map((project) => {
          const isSelected = selectedSlug === project.slug;

          return (
            <Marker
              key={project.slug}
              position={[project.lat, project.lng]}
              icon={createPinIcon(project, isSelected)}
              eventHandlers={{
                click: () => onSelect?.(project.slug),
                mouseover: () => onSelect?.(project.slug),
              }}
            >
              <Popup minWidth={250} closeButton={false}>
                <article className="project-map-popup">
                  <img src={project.cardImage} alt={project.name} />
                  <div className="project-map-popup-body">
                    <div className="project-map-popup-meta">
                      <span>{project.city}</span>
                      <span>{project.yield} ROI</span>
                    </div>
                    <h3>{project.name}</h3>
                    <p>{project.address}</p>
                    <div className="project-map-popup-footer">
                      <strong>{project.priceFrom}</strong>
                      <Link href={`/project/${project.slug}`}>
                        <a>Details</a>
                      </Link>
                    </div>
                  </div>
                </article>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      {!projects.length && (
        <div className="project-map-empty" style={{ color: C.muted, background: C.parchment }}>
          No projects match the current filters.
        </div>
      )}
      <div className="project-map-credit" style={{ background: C.light, color: C.dark }}>
        Map view inspired by market search patterns: filter, scan pins, then open a project.
      </div>
    </div>
  );
}
