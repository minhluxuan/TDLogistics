const fs = require("fs");

const data = JSON.parse(fs.readFileSync("../lib/fee.json", "utf-8"));

const calculteFee = (serviceCode, source, destination, distance, mass, increasingRateWhenBelongToRemoteArea, isBelongToRemoteArea = false) => {
    let resultFee = 0;
    if (serviceCode === "CPN") {
        if (source === destination) {
            for (const rangeMass of data.CPN.inner_province) {
                if (rangeMass.to_mass === "INFINITY") {
                    resultFee = rangeMass.base_fee + (mass - rangeMass.from_mass) * rangeMass.increment_per_gram;
                }

                if (mass > rangeMass.from_mass && mass <= rangeMass.to_mass) {
                    resultFee = rangeMass.fee;
                }
            }
        }
        else {
            for (const location of data.CPN.outer_province.special_case) {
                if (source === location.from_province && destination === location.to_province) {
                    for (const rangeMass of location.detail_mass) {
                        if (rangeMass.to_mass === "INFINITY") {
                            resultFee = rangeMass.base_fee + (mass - rangeMass.from_mass) * rangeMass.increment_per_gram;
                        }
        
                        if (mass > rangeMass.from_mass && mass <= rangeMass.to_mass) {
                            resultFee = rangeMass.fee;
                        }
                    }
                }
            }

            for (const rangeDistance of data.CPN.outer_province.ordinary_case) {
                if (rangeDistance.to_distance === "INFINITY") {
                    for (const rangeMass of rangeDistance.detail_mass) {
                        if (rangeMass.to_mass === "INFINITY") {
                            resultFee = rangeMass.base_fee + (mass - rangeMass.from_mass) * rangeMass.increment_per_gram;
                        }
        
                        if (mass > rangeMass.from_mass && mass <= rangeMass.to_mass) {
                            resultFee = rangeMass.fee;
                        }
                    }
                }

                if (distance > rangeDistance.from_distance && distance <= rangeDistance.to_distance) {
                    for (const rangeMass of rangeDistance.detail_mass) {
                        if (rangeMass.to_mass === "INFINITY") {
                            resultFee = rangeMass.base_fee + (mass - rangeMass.from_mass) * rangeMass.increment_per_gram;
                        }
        
                        if (mass > rangeMass.from_mass && mass <= rangeMass.to_mass) {
                            resultFee = rangeMass.fee;
                        }
                    }
                }
            }
        }
    }

    return isBelongToRemoteArea ? resultFee * (1 + increasingRateWhenBelongToRemoteArea) : resultFee;
}