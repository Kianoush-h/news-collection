import { NextResponse } from "next/server";
import {
  getDayOfConflict,
  getDayOfBlockade,
  straitStatus,
  conflictEvents,
  shipTrackingData,
  gasPricesByState,
  curatedMetrics,
  CONFLICT_START,
} from "@/lib/curated";

export async function GET() {
  return NextResponse.json({
    dayOfConflict: getDayOfConflict(),
    dayOfBlockade: getDayOfBlockade(),
    conflictStartDate: CONFLICT_START,
    straitStatus,
    conflictEvents,
    shipTrackingData,
    gasPricesByState,
    ...curatedMetrics,
    updatedAt: new Date().toISOString(),
  });
}
