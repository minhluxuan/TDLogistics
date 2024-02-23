const fs = require("fs");

const area = JSON.parse(fs.readFileSync("./lib/area.json", "utf-8"));
const data = JSON.parse(fs.readFileSync("./lib/fee.json", "utf-8"));

const calculteFee = (serviceCode, source, destination, distance, mass, increasingRateWhenBelongToRemoteArea, isBelongToRemoteArea = false) => {
    let resultFee = 0;
    if (serviceCode === "CPN") {
        if (source === destination) {
            for (const rangeMass of data.CPN.inner_province) {
                if (rangeMass.to_mass === "INFINITY") {
                    resultFee = rangeMass.base_fee + Math.floor((mass - rangeMass.from_mass)/500)* rangeMass.increment_per_kilogram;
                }

                if (mass > rangeMass.from_mass && mass <= rangeMass.to_mass) {
                    resultFee = rangeMass.fee;
                    break;
                }
            }
        }
        else {
            for (const location of data.CPN.outer_province.special_case) {
                if (source === location.from_province && destination === location.to_province) {
                    for (const rangeMass of location.detail_mass) {
                        if (rangeMass.to_mass === "INFINITY") {
                            resultFee = rangeMass.base_fee + Math.floor((mass - rangeMass.from_mass)/500) * rangeMass.increment_per_kilogram;
                        }
        
                        if (mass > rangeMass.from_mass && mass <= rangeMass.to_mass) {
                            resultFee = rangeMass.fee;
                            break;
                        }
                    }
                }
            }

            for (const rangeDistance of data.CPN.outer_province.ordinary_case) {
                if (rangeDistance.to_distance === "INFINITY") {
                    for (const rangeMass of rangeDistance.detail_mass) {
                        if (rangeMass.to_mass === "INFINITY") {
                            resultFee = rangeMass.base_fee + Math.floor((mass - rangeMass.from_mass)/500) * rangeMass.increment_per_gram;
                        }
        
                        if (mass > rangeMass.from_mass && mass <= rangeMass.to_mass) {
                            resultFee = rangeMass.fee;
                            break;
                        }
                    }
                }

                if (distance > rangeDistance.from_distance && distance <= rangeDistance.to_distance) {
                    for (const rangeMass of rangeDistance.detail_mass) {
                        if (rangeMass.to_mass === "INFINITY") {
                            resultFee = rangeMass.base_fee + Math.floor((mass - rangeMass.from_mass)/500) * rangeMass.increment_per_gram;
                        }
        
                        if (mass > rangeMass.from_mass && mass <= rangeMass.to_mass) {
                            resultFee = rangeMass.fee;
                            break;
                        }
                    }
                }
            }
        }
    }

    else if (serviceCode === "TTK") {
        let sourceArea;
        let desArea;
        const areaService = area.TTK
        for (const range in areaService ) 
        {
            if (areaService[range].includes(source))
            {
                sourceArea = range;
            }
            if (areaService[range].includes(destination))
            {
                desArea = range;
            }
        }
        const transferService = data.TTK;
        
        if (sourceArea === desArea) {
            for (const rangeMass of transferService["INNER_AREA"]) {
                if (rangeMass.hasOwnProperty("increme_per_kilogram")) {
                    let increamentfee;
                    let incremass = Math.floor((mass - 2000)/1000);
                    for (const rangeMassIncre of rangeMass.increme_per_kilogram.increme_fee)
                    {
                        if (incremass >= rangeMassIncre.from_mass && incremass < rangeMassIncre.to_mass) {
                            increamentfee = incremass * rangeMassIncre.fee;
                            break;
                        }

                        if (rangeMassIncre.to_mass === "INFINITY") {
                            increamentfee = incremass * rangeMassIncre.fee;
                        }
                        
                    }
                    resultFee = rangeMass.increme_per_kilogram.base_fee + increamentfee ;
                }

                if (mass >= rangeMass.from_mass && mass < rangeMass.to_mass) {
                    resultFee = rangeMass.fee;
                    break;
                }
            }
        }

        else if (sourceArea === "NORTH_AREA" && desArea === "MIDDLE_AREA" || desArea === "NORTH_AREA" && sourceArea === "MIDDLE_AREA" 
        || sourceArea === "SOUTH_AREA" && desArea === "MIDDLE_AREA" || desArea === "SOUTH_AREA"  && sourceArea === "MIDDLE_AREA"){
            for (const rangeMass of transferService["OUTER_AREA"]) {
                if (rangeMass.hasOwnProperty("increme_per_kilogram")) {
                    let increamentfee;
                    let incremass = Math.floor((mass - 2000)/1000);
                    for (const rangeMassIncre of rangeMass.increme_per_kilogram.increme_fee)
                    {
                        if (incremass >= rangeMassIncre.from_mass && incremass < rangeMassIncre.to_mass) {
                            increamentfee = incremass * rangeMassIncre.fee;
                            break;
                        }

                        if (rangeMassIncre.to_mass === "INFINITY") {
                            increamentfee = incremass * rangeMassIncre.fee;
                        }
                    }
                    resultFee = rangeMass.increme_per_kilogram.base_fee + increamentfee ;
                }

                if (mass >= rangeMass.from_mass && mass < rangeMass.to_mass) {
                    resultFee = rangeMass.fee;
                    break;
                }
            }
        }
        else {
            for (const rangeMass of transferService["SEPERATE_AREA"]) {
                if (rangeMass.hasOwnProperty("increme_per_kilogram")) {
                    let increamentfee;
                    let incremass = Math.floor((mass - 2000)/1000) ;
                    for (const rangeMassIncre of rangeMass.increme_per_kilogram.increme_fee)
                    {
                        if (incremass >= rangeMassIncre.from_mass && incremass < rangeMassIncre.to_mass) {
                            increamentfee = incremass * rangeMassIncre.fee;
                            break;
                        }

                        if (rangeMassIncre.to_mass === "INFINITY") {
                            increamentfee = incremass * rangeMassIncre.fee;
                        }
                    }
                    resultFee = rangeMass.increme_per_kilogram.base_fee + increamentfee ;
                }

                if (mass >= rangeMass.from_mass && mass < rangeMass.to_mass) {
                    resultFee = rangeMass.fee;
                    break;
                }
            }
        }
    }

    if (serviceCode === "HTT") {
        let sourceArea;
        let desArea;
        const areService = area.HTT;
        for (const range in areService) 
        {   
            if (areService[range].includes(destination) )
            {
                desArea = range;
                break;
            }
        }

        if (desArea === "HN" || desArea === "HN_OUTER")
        {
            if (areService["FLIGHTSTRAIGHT_TO_HN_AND_OUTER"].includes(source))
            {
                sourceArea = "FLIGHTSTRAIGHT_TO_HN_AND_OUTER";
            }
        }
        else if (desArea === "HCM" || desArea === "HCM_OUTER")
        {
            if (areService["FLIGHTSTRAIGHT_TO_HCM_AND_OUTER"].includes(source))
            {
                sourceArea = "FLIGHTSTRAIGHT_TO_HCM_AND_OUTER";
            }
        }
        else if (desArea === "DN" )
        {
            if (areService["FLIGHTSTRAIGHT_TO_DN_AND_OUTER"].includes(source))
            {
                sourceArea = "FLIGHTSTRAIGHT_TO_DN_AND_OUTER";
            }
        }

        if (sourceArea === undefined)
        {
            for (const range in areService) 
            {
                if (areService[range].includes(source) )
                {
                    sourceArea = range;
                    break;
                }
            }
        }

        const transferService = data.HTT;
        for (const rangeMass of transferService[desArea][sourceArea]) {
            if (rangeMass.to_mass === "INFINITY") {
                resultFee = rangeMass.base_fee + Math.floor((mass - rangeMass.from_mass)/500)* rangeMass.increment_per_kilogram;
            }

            if (mass >= rangeMass.from_mass && mass < rangeMass.to_mass) {
                resultFee = rangeMass.fee;
                break;
            }
        }
    }
    return isBelongToRemoteArea ? resultFee * (1 + increasingRateWhenBelongToRemoteArea) : resultFee;
}

console.log (calculteFee("TTK","TP.Hồ Chí Minh", "Hà Nội", 0, 250, 0));
