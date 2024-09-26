import type { DistanceFeet, DistanceKiloMeters, DistanceMeters, DistanceMiles } from "@/units";

export class MeasurementSystemsConverter {
    static convertMetersToFeet(meters: DistanceMeters): DistanceFeet {
        return (meters * 3.28084) as DistanceFeet;
    }

    static convertKilometersToMiles(kilometers: DistanceKiloMeters): DistanceMiles {
        return (kilometers * 0.621371) as DistanceMiles;
    }

    static convertFeetToMeters(feet: DistanceFeet): DistanceMeters {
        return (feet / 3.28084) as DistanceMeters;
    }

    static convertMilesToKilometers(miles: DistanceMiles): DistanceKiloMeters {
        return (miles / 0.621371) as DistanceKiloMeters;
    }

    static convertKiometersToMeters(kilometers: DistanceKiloMeters): DistanceMeters {
        return (kilometers * 1000) as DistanceMeters;
    }

    static convertMetersToKilometers(meters: DistanceMeters): DistanceKiloMeters {
        return (meters / 1000) as DistanceKiloMeters;
    }

    static convertMilesToFeet(miles: DistanceMiles): DistanceFeet {
        return (miles * 5280) as DistanceFeet;
    }

    static convertFeetToMiles(feet: DistanceFeet): DistanceMiles {
        return (feet / 5280) as DistanceMiles;
    }

    static convertMetersToMiles(meters: DistanceMeters): DistanceMiles {
        return MeasurementSystemsConverter.convertKilometersToMiles(MeasurementSystemsConverter.convertMetersToKilometers(meters));
    }
}
