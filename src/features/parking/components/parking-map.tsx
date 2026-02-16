"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

type SpotStatus = "available" | "occupied" | "selected" | "reserved";

interface ParkingSpot {
  id: string;
  row: string;
  number: number;
  status: SpotStatus;
  type: "standard" | "handicap" | "ev";
  price: number;
}

const generateParkingSpots = (): ParkingSpot[] => {
  const rows = ["A", "B", "C", "D"];
  const spots: ParkingSpot[] = [];

  rows.forEach((row) => {
    for (let i = 1; i <= 8; i++) {
      const rand = Math.random();
      let status: SpotStatus = "available";
      if (rand > 0.6) status = "occupied";
      else if (rand > 0.5) status = "reserved";

      let type: "standard" | "handicap" | "ev" = "standard";
      if (row === "A" && i <= 2) type = "handicap";
      if (row === "D" && i >= 7) type = "ev";

      spots.push({
        id: `${row}${i}`,
        row,
        number: i,
        status,
        type,
        price: type === "ev" ? 8 : type === "handicap" ? 5 : 6,
      });
    }
  });

  return spots;
};

interface ParkingMapProps {
  onSpotSelect: (spot: ParkingSpot | null) => void;
  selectedSpot: ParkingSpot | null;
}

export function ParkingMap({ onSpotSelect, selectedSpot }: ParkingMapProps) {
  const [spots] = useState<ParkingSpot[]>(generateParkingSpots);

  const getSpotColor = (spot: ParkingSpot) => {
    if (selectedSpot?.id === spot.id) {
      return "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2";
    }
    switch (spot.status) {
      case "available":
        return "bg-accent text-accent-foreground hover:bg-accent/80 cursor-pointer";
      case "occupied":
        return "bg-muted text-muted-foreground cursor-not-allowed";
      case "reserved":
        return "bg-chart-5/20 text-chart-5 cursor-not-allowed";
      default:
        return "bg-muted";
    }
  };

  const handleSpotClick = (spot: ParkingSpot) => {
    if (spot.status !== "available") return;
    if (selectedSpot?.id === spot.id) {
      onSpotSelect(null);
    } else {
      onSpotSelect(spot);
    }
  };

  const rows = ["A", "B", "C", "D"];

  return (
    <div className="w-full rounded-2xl border border-border bg-card p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-semibold text-card-foreground text-lg">
          Select a Spot
        </h3>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-sm bg-accent" />
            <span className="text-muted-foreground">Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-sm bg-muted" />
            <span className="text-muted-foreground">Occupied</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-sm bg-chart-5/20" />
            <span className="text-muted-foreground">Reserved</span>
          </div>
        </div>
      </div>

      <div className="relative">
        {/* Entrance */}
        <div className="mb-6 flex items-center justify-center border-border border-y-2 border-dashed py-2">
          <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
            Entrance
          </span>
        </div>

        {/* Parking Grid */}
        <div className="space-y-3">
          {rows.map((row) => (
            <div key={row} className="flex items-center gap-2">
              <span className="w-6 font-medium text-muted-foreground text-sm">
                {row}
              </span>
              <div className="grid flex-1 grid-cols-8 gap-2">
                {spots
                  .filter((s) => s.row === row)
                  .map((spot) => (
                    <button
                      key={spot.id}
                      type="button"
                      onClick={() => handleSpotClick(spot)}
                      disabled={spot.status !== "available"}
                      className={cn(
                        "relative flex aspect-[3/4] flex-col items-center justify-center rounded-md font-medium text-xs transition-all",
                        getSpotColor(spot),
                      )}
                    >
                      <span className="text-[10px]">{spot.id}</span>
                      {spot.type === "handicap" && (
                        <span className="absolute bottom-0.5 text-[8px]">
                          ♿
                        </span>
                      )}
                      {spot.type === "ev" && (
                        <span className="absolute bottom-0.5 text-[8px]">
                          ⚡
                        </span>
                      )}
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* Exit */}
        <div className="mt-6 flex items-center justify-center border-border border-y-2 border-dashed py-2">
          <span className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
            Exit
          </span>
        </div>
      </div>
    </div>
  );
}

export type { ParkingSpot };
