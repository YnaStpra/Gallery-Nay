"use client";

import Image from "next/image";
import { useEffect, useMemo } from "react";
import {
  MapContainer as LeafletMapContainer,
  Marker,
  Popup,
  TileLayer,
  ZoomControl,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import type { GalleryPhoto } from "@/src/lib/gallery-data";
import "leaflet/dist/leaflet.css";
import "react-leaflet-cluster/dist/assets/MarkerCluster.css";
import "react-leaflet-cluster/dist/assets/MarkerCluster.Default.css";

const MAP_CENTER: [number, number] = [0, 100];
const MAP_ZOOM = 2;

type ClusterMarker = {
  options: {
    photoId?: string;
  };
};

type ClusterEvent = {
  layer: {
    getAllChildMarkers?: () => ClusterMarker[];
  };
};

type Props = {
  photos: GalleryPhoto[];
  selectedPhotoId: string | null;
  onSelect: (photoId: string) => void;
  onSelectCluster: (photoIds: string[]) => void;
  onClusterFocus: (photoIds: string[]) => void;
};

function configureMarkerIcon() {
  const iconHtml = `
    <div style="background: rgba(20, 184, 166, 0.95); border: 2px solid rgba(255,255,255,0.18); border-radius: 9999px; box-shadow: 0 0 0 2px rgba(15,23,42,0.85); width: 24px; height: 24px;"></div>
  `;

  return new L.DivIcon({
    className: "custom-marker-icon",
    html: iconHtml,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });
}

export function MapContainer({
  photos,
  selectedPhotoId,
  onSelect,
  onSelectCluster,
  onClusterFocus,
}: Props) {
  const filteredPhotos = useMemo(
    () => photos.filter((photo) => photo.coordinates != null),
    [photos],
  );

  const mapMarkers = useMemo(
    () =>
      filteredPhotos.map((photo) => ({
        ...photo,
        coords: photo.coordinates!,
      })),
    [filteredPhotos],
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    delete (
      L.Icon.Default as unknown as {
        prototype: { _getIconUrl?: unknown };
      }
    ).prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  const clusterIcon = useMemo(() => configureMarkerIcon(), []);

  return (
    <LeafletMapContainer
      center={MAP_CENTER}
      zoom={MAP_ZOOM}
      scrollWheelZoom={true}
      zoomControl={false}
      className="h-full w-full"
    >
      <ZoomControl position="bottomright" />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />

      <MarkerClusterGroup
        chunkedLoading
        spiderfyOnMaxZoom={true}
        showCoverageOnHover={false}
        disableClusteringAtZoom={12}
        onClick={(event: ClusterEvent) => {
          const cluster = event.layer;
          const markers = cluster.getAllChildMarkers?.() ?? [];
          const photoIds = markers
            .map((marker) => marker.options.photoId)
            .filter(Boolean);
          if (photoIds.length === 1) {
            onSelect(photoIds[0]);
          } else if (photoIds.length > 1) {
            onSelectCluster(photoIds);
          }
        }}
        onMouseOver={(event: ClusterEvent) => {
          const cluster = event.layer;
          const markers = cluster.getAllChildMarkers?.() ?? [];
          const photoIds = markers
            .map((marker) => marker.options.photoId)
            .filter(Boolean);
          onClusterFocus(photoIds);
        }}
      >
        {mapMarkers.map((photo) => (
          <Marker
            key={photo.id}
            position={[photo.coords.lat, photo.coords.lng]}
            icon={clusterIcon}
            eventHandlers={{
              click: () => onSelect(photo.id),
            }}
            title={photo.title}
            alt={photo.alt}
            opacity={
              selectedPhotoId === null || selectedPhotoId === photo.id
                ? 0.95
                : 0.48
            }
            {...{ photoId: photo.id }}
          >
            <Popup>
              <div className="max-w-xs">
                <p className="text-sm font-semibold text-slate-900">
                  {photo.title}
                </p>
                <p className="text-xs text-slate-600">{photo.location}</p>
                <Image
                  src={photo.imageUrl}
                  alt={photo.alt}
                  width={240}
                  height={112}
                  className="mt-3 h-28 w-full rounded-2xl object-cover"
                />
              </div>
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </LeafletMapContainer>
  );
}
