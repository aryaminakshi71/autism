"use client";

import { type ParkingSpot } from "@/components/parking-map";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Car,
  CheckCircle2,
  Clock,
  CreditCard,
  MapPin,
} from "lucide-react";
import { useState } from "react";

interface BookingPanelProps {
  selectedSpot: ParkingSpot | null;
  onBook: () => void;
}

export function BookingPanel({ selectedSpot, onBook }: BookingPanelProps) {
  const [isBooked, setIsBooked] = useState(false);

  const handleBook = () => {
    setIsBooked(true);
    onBook();
  };

  if (isBooked && selectedSpot) {
    return (
      <div className="rounded-2xl border border-accent bg-accent/10 p-6">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent">
            <CheckCircle2 className="h-6 w-6 text-accent-foreground" />
          </div>
          <h3 className="mb-2 font-semibold text-foreground text-lg">
            Booking Confirmed!
          </h3>
          <p className="mb-4 text-muted-foreground text-sm">
            Spot {selectedSpot.id} has been reserved for you
          </p>
          <div className="w-full space-y-3 rounded-xl border border-border bg-card p-4 text-left">
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground text-xs">Location</p>
                <p className="font-medium text-sm">Downtown Parking Garage</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Car className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground text-xs">Spot</p>
                <p className="font-medium text-sm">{selectedSpot.id}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground text-xs">Date</p>
                <p className="font-medium text-sm">Jan 25, 2026</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground text-xs">Time</p>
                <p className="font-medium text-sm">10:00 AM - 1:00 PM</p>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            className="mt-4 w-full bg-transparent"
            onClick={() => setIsBooked(false)}
          >
            Book Another Spot
          </Button>
        </div>
      </div>
    );
  }

  if (!selectedSpot) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Car className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mb-2 font-semibold text-card-foreground text-lg">
            Select a Parking Spot
          </h3>
          <p className="max-w-[200px] text-muted-foreground text-sm">
            Click on an available spot in the map to see details and book
          </p>
        </div>
      </div>
    );
  }

  const duration = 3;
  const total = selectedSpot.price * duration;

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h3 className="mb-4 font-semibold text-card-foreground text-lg">
        Booking Details
      </h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between border-border border-b py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <span className="font-bold text-primary-foreground text-sm">
                {selectedSpot.id}
              </span>
            </div>
            <div>
              <p className="font-medium text-card-foreground text-sm">
                Spot {selectedSpot.id}
              </p>
              <p className="text-muted-foreground text-xs capitalize">
                {selectedSpot.type === "ev"
                  ? "EV Charging"
                  : selectedSpot.type === "handicap"
                    ? "Accessible"
                    : "Standard"}{" "}
                Spot
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold text-card-foreground text-sm">
              ${selectedSpot.price}/hr
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Date</span>
            <span className="font-medium">Jan 25, 2026</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Time</span>
            <span className="font-medium">10:00 AM - 1:00 PM</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Duration</span>
            <span className="font-medium">{duration} hours</span>
          </div>
        </div>

        <div className="border-border border-t pt-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-card-foreground text-sm">
              Total
            </span>
            <span className="font-bold text-card-foreground text-xl">
              ${total.toFixed(2)}
            </span>
          </div>
          <p className="mt-1 text-muted-foreground text-xs">
            Includes all taxes and fees
          </p>
        </div>

        <Button className="w-full gap-2" size="lg" onClick={handleBook}>
          <CreditCard className="h-4 w-4" />
          Reserve Now
        </Button>

        <p className="text-center text-muted-foreground text-xs">
          {"You won't be charged yet"}
        </p>
      </div>
    </div>
  );
}
