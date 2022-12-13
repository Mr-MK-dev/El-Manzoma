const _ = require("lodash");
function shuffle(array) {
  array.sort(() => Math.random());
  array.sort(() => Math.random());
  array.sort(() => Math.random());

  return array;
}
let unitsRelated = {};
let improvedCands = {};

function getItem(unit, array, level = 0) {
  if (!unitsRelated[unit.Unit.UnitID]) {
    unitsRelated[unit.Unit.UnitID] = [];
  }
  let item = array.filter(ele => {
    return (
      unitsRelated[unit.Unit.UnitID].indexOf(ele[0].rateb.Unit.UnitID) === -1
    );
  })[0];

  if (!item && array.length) {
    unitsRelated[unit.Unit.UnitID].shift();
    getItem(unit, array, level + 1);
  }
  if (item) {
    unitsRelated[unit.Unit.UnitID].push(item[0].rateb.Unit.UnitID);
  }
  return item;
}

export default {
  allocatedTransferedData: (
    unitsPreparedData,
    candidates,
    support,
    forceSoltes
  ) => {
    let candidatesLevels = {};
    let levels = ["جندي", "عريف", "رقيب", "رقيب اول", "مساعد", "مساعد اول"];
    candidates.map(ele => ({
      ...ele,
      levelIndex: levels.indexOf(ele.rateb.RatebLevel)
    }));

    levels.forEach(level => {
      candidatesLevels[level] = candidates.filter(ele =>
        ele.rateb.RatebLevel?.includes(level)
      ).length;
    });

    let unitsPastLevel = {};

    let getBestLevel = (cands, unit) => {
      if (!unitsPastLevel[unit.Unit.UnitID]) {
        unitsPastLevel[unit.Unit.UnitID] = {};
      }
      let item = cands.pop();

      if (item) {
        if (!unitsPastLevel[unit.Unit.UnitID][item[0].rateb.RatebLevel]) {
          unitsPastLevel[unit.Unit.UnitID][item[0].rateb.RatebLevel] = 0;
        }
        unitsPastLevel[unit.Unit.UnitID][item[0].rateb.RatebLevel] += 1;
      }

      return item;
    };
    //
    let getBestRatebForUnit = (ratebs, unit) => {
      let extraProfitType = [
        {
          text: "متوسط",
          value: "1"
        },
        {
          text: "عالي",
          value: "2"
        },
        {
          text: "لا",
          value: "0"
        }
      ];

      ratebs = shuffle(ratebs).reverse();
      let descrptions = [];

      // see candidates in other direction
      let anotherDirectionRateb = ratebs.filter(
        ele =>
          !ele.preuints.find(
            u => u.Unit.Directionforunit == unit.Unit.Directionforunit
          )
      );

      if (anotherDirectionRateb.length > 0) {
        descrptions.push("تلك الوحدة في اتجاه مختلف عن الاتجاه الحالي");

        let candidatesWithAntherHardWork =
          unit.Unit.isSpecial || !unit.Unit.isHardWork
            ? anotherDirectionRateb
                .filter(ele => ele.rateb.Unit.isHardWork)
                .map(ele => ({
                  ...ele
                }))
            : anotherDirectionRateb;

        let filteredItems =
          unit.Unit.isSpecial || !unit.Unit.isHardWork
            ? candidatesWithAntherHardWork
            : anotherDirectionRateb
                .filter(ele => !ele.rateb.Unit.isHardWork)
                .map(ele => ({
                  ...ele
                }));
        anotherDirectionRateb = filteredItems.length
          ? filteredItems
          : anotherDirectionRateb;
        if (candidatesWithAntherHardWork.length && unit.Unit.isSpecial) {
          descrptions.push(
            unit.Unit.isSpecial
              ? `لان الوحدة السابقة كانت شاقة`
              : `لان الوحدة السابقة لم تكن شاقة`
          );
        }

        let minimumDegreeRatebs = anotherDirectionRateb.filter(ele => {
          let maximumDegree = unit.Unit.maximumDegree
            ? levels.indexOf(ele.rateb.RatebLevel) <=
              levels.indexOf(unit.Unit.maximumDegree)
            : true;
          return (
            levels.indexOf(ele.rateb.RatebLevel) >=
            levels.indexOf(unit.Unit.minimumDegree)
          );
        });

        anotherDirectionRateb = unit.Unit.minimumDegree
          ? minimumDegreeRatebs
          : anotherDirectionRateb;
        if (minimumDegreeRatebs.length && unit.Unit.minimumDegree) {
          6;
          9;
          10;
          11;

          descrptions.push(
            " الوحدة لا تقبل اقل من" + " " + unit.Unit.minimumDegree
          );
        }

        let candidatesWithAnotherExtraProfitType = anotherDirectionRateb
          .filter(ele => {
            return ele.rateb.Unit.extraProfitType != unit.Unit.extraProfitType;
          })
          .map(ele => {
            return {
              ...ele,
              desc: ` لان الوحدة السابقة كانت ذات جهد ${
                extraProfitType.find(
                  e => e.value == ele.rateb.Unit.extraProfitType
                )?.text
              }`
            };
          });

        let candidatesWithCategory = anotherDirectionRateb
          .filter(ele => ele.rateb.Unit.Category != unit.Unit.Category)
          .map(ele => ({
            ...ele,
            desc: `لان الوحدة السابقة كانت ${ele.rateb.Unit.Category}`
          }));
        let unitsFilterItem = getItem(
          unit,
          Object.values(
            _.groupBy(
              [
                ...candidatesWithAnotherExtraProfitType,
                ...candidatesWithCategory
              ],
              ele => ele.ID
            )
          )
        );
        if (unitsFilterItem && unitsFilterItem[0]) {
          return {
            rateb: unitsFilterItem[0],
            descrptions: [
              ...descrptions,
              ...unitsFilterItem.map(ele => ele.desc)
            ]
          };
        }

        return { rateb: anotherDirectionRateb[0], descrptions };
      } else {
        return { rateb: ratebs[0], descrptions, needImprove: true };
      }
    };
    let finalAllocation = [];

    let slots = {};

    unitsPreparedData.forEach(unit => {
      unit.slots.forEach(slot => {
        slots[unit.unitID + slot.category] =
          slot.count - (forceSoltes[unit.unitID + slot.category] || 0);
      });
    });
    let recommended = candidates.filter(
      ele => ele.recommendation && ele.recommendation.isCertified
    );

    for (let i = 0; i < recommended.length; i++) {
      let selectedUnitOfRecommendation = unitsPreparedData.find(
        ele => ele.unitID == recommended[i].recommendation.RecommendedUnitID
      );
      if (selectedUnitOfRecommendation) {
        if (
          selectedUnitOfRecommendation.slots.find(
            ele => ele.category == recommended[i].category
          ).count > 0
        ) {
          candidates.splice(
            candidates.findIndex(can => can.ID == recommended[i].ID),
            1
          );

          finalAllocation.push({
            RatebID: recommended[i].ID,
            rateb: recommended[i],
            TransferedToUnitId: selectedUnitOfRecommendation.unitID,
            ReasonType: "Recommendation",
            ReasonId: recommended[i].recommendation.ID_KEY,
            DecisionNotes: !recommended[i].recommendation.isHidden
              ? "تم توزيع هذا الفرد بناءا على التوصية الموجودة"
              : "تلك الوحدة في اتجاه مختلف عن الاتجاه الحالي"
          });
          slots[selectedUnitOfRecommendation.unitID + recommended[i].category] =
            slots[
              selectedUnitOfRecommendation.unitID + recommended[i].category
            ] - 1;
        }
      }
    }

    let forceTransfers = candidates.filter(ele => ele.forceTransfer);

    for (let i = 0; i < forceTransfers.length; i++) {
      finalAllocation.push({
        RatebID: forceTransfers[i].ID,
        rateb: forceTransfers[i],
        TransferedToUnitId: forceTransfers[i].forceTransfer.RecommendedUnitID,
        ReasonType: "forceTransfers",
        ReasonId: forceTransfers[i].forceTransfer.ID_KEY,
        DecisionNotes: "تم توزيعه بناء علي نشرة التنقالات للمخابرات"
      });
      candidates.splice(
        candidates.findIndex(can => can.ID == forceTransfers[i].ID),
        1
      );
    }

    let requested = candidates.filter(
      ele => ele.request && ele.request.isCertified
    );

    for (let i = 0; i < requested.length; i++) {
      let selectedUnitOfRequest = unitsPreparedData.find(
        ele => ele.unitID == requested[i].request.RecommendedUnitID
      );

      if (selectedUnitOfRequest) {
        if (
          selectedUnitOfRequest.slots.find(
            ele => ele.category == requested[i].category
          ).count > 0
        ) {
          candidates.splice(
            candidates.findIndex(can => can.ID == requested[i].ID),
            1
          );
          finalAllocation.push({
            RatebID: requested[i].ID,
            rateb: requested[i],
            TransferedToUnitId: selectedUnitOfRequest.unitID,
            ReasonType: "Request",
            ReasonId: requested[i].request.ID_KEY,
            DecisionNotes: "تم توزيع هذا الفرد بناءا على الالتماس الموجود"
          });

          slots[selectedUnitOfRequest.unitID + requested[i].category] =
            slots[selectedUnitOfRequest.unitID + requested[i].category] - 1;
        }
      }
    }

    support.forEach(ele => {
      for (let index = 0; index < parseInt(ele.count); index++) {
        let unitCandidates = candidates.filter(can => {
          return (
            can.UnitID != ele.unitId &&
            !can.preuints.find(uni => uni.uintid == ele.Unit.UnitID) &&
            (can.Job.ID_KEY == ele.Job ||
              (can.previousJobs.find(job => job.ID_KEY == ele.Job) &&
                !can.Job.isCritical))
          );
        });

        let bestRatebDetails = getBestRatebForUnit(unitCandidates, {
          Unit: ele.Unit
        });
        if (
          !bestRatebDetails.rateb ||
          slots[ele.Unit.UnitID + bestRatebDetails.rateb.category] == 0
        ) {
          //
        } else {
          candidates.splice(
            candidates.findIndex(can => bestRatebDetails.rateb.ID == can.ID),
            1
          );

          finalAllocation.push({
            RatebID: bestRatebDetails.rateb.ID,
            TransferedToUnitId: ele.Unit.UnitID,
            rateb: bestRatebDetails.rateb,
            ReasonType: "CriticalJob",
            DecisionNotes: [
              "تم توزيعه لانه يعمل في وظيفة حرجة والوحدة بحاجة للتلك الوظيفة",
              ...bestRatebDetails.descrptions
            ].join(" - - ")
          });

          slots[ele.Unit.UnitID + bestRatebDetails.rateb.category] =
            slots[ele.Unit.UnitID + bestRatebDetails.rateb.category] - 1;
        }
      }
    });

    let NeededEfficiencyUnits = unitsPreparedData.filter(
      ele => ele.isRasisingEfficiency == true
    );
    for (let i = 0; i < NeededEfficiencyUnits.length; i++) {
      let highRated = candidates.filter(
        ele =>
          ele.rateb.AverageRate >=
            NeededEfficiencyUnits[i].MinimumHighRatedRequirement &&
          ele.rateb.AverageRate <=
            NeededEfficiencyUnits[i].MaximumHighRatedRequirement
      );
      let Count = NeededEfficiencyUnits[i].NeededHighRateb;

      for (let k = 0; k < NeededEfficiencyUnits[i].slots.length; k++) {
        while (NeededEfficiencyUnits[i].slots[k].count) {
          if (
            Count &&
            highRated.length &&
            highRated.find(
              ele => ele.category === NeededEfficiencyUnits[i].slots[k].category
            )
          ) {
            finalAllocation.push({
              RatebID: highRated.find(
                ele =>
                  ele.category === NeededEfficiencyUnits[i].slots[k].category
              ).ID,
              rateb: highRated.find(
                ele =>
                  ele.category === NeededEfficiencyUnits[i].slots[k].category
              ),
              TransferedToUnitId: NeededEfficiencyUnits[i].unitID,
              ReasonType: "HighRated",
              DecisionNotes: "تم توزيع هذا الفرد للكفاءه العالية"
            });

            candidates.splice(
              candidates.findIndex(
                can =>
                  can.ID ==
                  highRated.find(
                    ele =>
                      ele.category ===
                      NeededEfficiencyUnits[i].slots[k].category
                  ).ID
              ),
              1
            );
            highRated.splice(
              highRated.findIndex(
                can =>
                  can.ID ==
                  highRated.find(
                    ele =>
                      ele.category ===
                      NeededEfficiencyUnits[i].slots[k].category
                  ).ID
              ),
              1
            );
            Count--;
            NeededEfficiencyUnits[i].slots[k].count--;
            slots[
              NeededEfficiencyUnits[i].unitID +
                highRated.find(
                  ele =>
                    ele.category === NeededEfficiencyUnits[i].slots[k].category
                ).category
            ] =
              slots[
                NeededEfficiencyUnits[i].unitID +
                  highRated.find(
                    ele =>
                      ele.category ===
                      NeededEfficiencyUnits[i].slots[k].category
                  ).category
              ] - 1;
          } else {
            break;
          }
        }
      }
    }

    let errors = [];

    unitsPreparedData = _.orderBy(
      unitsPreparedData,
      "unit.minimumDegree",
      "asc"
    );

    // Object.values(
    //   _.groupBy(unitsPreparedData, ele => ele.unit.Directionforunit)
    // ).forEach(unitsWithDir => {
    unitsPreparedData
      .sort((a, b) => b.slots[0].count - a.slots[0].count)
      .forEach((unit, unitIndex) => {
        console.log("unitttttt", unit);
        unit.slots
          .sort((a, b) => b.count - a.count)
          .forEach((slot, index) => {
            for (let index = 0; index < slot.count; index++) {
              let unitCandidates = candidates.filter(can => {
                return (
                  can.UnitID != unit.unitID &&
                  !can.preuints.find(uni => uni.uintid == unit.unitID) &&
                  !can.rateb.Unit.Directionforunit.includes(
                    unit.unit.Directionforunit
                  ) &&
                  slot.category == can.category
                );
              });
              let unitCandidatesWithSameDir = candidates.filter(can => {
                return (
                  can.UnitID != unit.unitID &&
                  !can.preuints.find(uni => uni.uintid == unit.unitID) &&
                  slot.category == can.category
                );
              });
              let bestRatebDetails = getBestRatebForUnit(unitCandidates, {
                Unit: unit.unit
              });

              if (!bestRatebDetails.rateb) {
                bestRatebDetails = getBestRatebForUnit(
                  unitCandidatesWithSameDir,
                  {
                    Unit: unit.unit
                  }
                );
                if (bestRatebDetails.rateb) {
                  improvedCands[bestRatebDetails.rateb.ID] = {
                    bestRatebDetails,
                    Unit: unit.unit
                  };
                }
              }
              if (bestRatebDetails.rateb) {
                if (bestRatebDetails.needImprove) {
                  improvedCands[bestRatebDetails.rateb.ID] = {
                    bestRatebDetails,
                    Unit: unit.unit
                  };
                }
                if (slots[unit.unitID + bestRatebDetails.rateb.category] <= 0)
                  return;

                let a = candidates.splice(
                  candidates.findIndex(
                    can => bestRatebDetails.rateb.ID == can.ID
                  ),
                  1
                );

                finalAllocation.push({
                  RatebID: bestRatebDetails.rateb.ID,
                  rateb: bestRatebDetails.rateb,
                  TransferedToUnitId: unit.unitID,
                  Unit: unit.unit,
                  ReasonType: "Random",
                  DecisionNotes: [...bestRatebDetails.descrptions].join(" - - ")
                });
                slots[unit.unitID + bestRatebDetails.rateb.category] =
                  slots[unit.unitID + bestRatebDetails.rateb.category] - 1;
              } else {
                errors.push({
                  unitCandidates,
                  unit: unit.unit,
                  slot
                });
              }
            }
          });
      });
    // });
    improvedCands = Object.values(improvedCands);
    for (const cand of improvedCands.filter(
      ele => ele.bestRatebDetails.rateb
    )) {
      let candIndex = finalAllocation.findIndex(
        ele => ele.RatebID == cand.bestRatebDetails.rateb.ID
      );

      if (finalAllocation[candIndex]) {
        let swapper = finalAllocation.filter(ele => {
          return (
            !ele.Unit?.Directionforunit.includes(cand.Unit.Directionforunit) &&
            !cand.bestRatebDetails.rateb.preuints
              .map(u => u.Unit.Directionforunit)
              .includes(ele.Unit?.Directionforunit) &&
            !ele.rateb.preuints
              .map(u => u.Unit.Directionforunit)
              .includes(cand.Unit?.Directionforunit) &&
            ele.ReasonType === "Random" &&
            !ele.rateb.rateb.Unit?.isSpecial &&
            !ele.rateb.rateb.Unit?.isHardWork
          );
        })[0];

        if (!swapper) {
          swapper = finalAllocation.filter(ele => {
            return (
              !ele.Unit?.Directionforunit.includes(
                cand.Unit.Directionforunit
              ) &&
                !cand.bestRatebDetails.rateb.preuints
                  .map(u => u.Unit.Directionforunit)
                  .slice(0, 3)
                  .includes(ele.Unit?.Directionforunit) &&
                !ele.rateb.preuints
                  .map(u => u.Unit.Directionforunit)
                  .includes(cand.Unit?.Directionforunit) &&
                ele.ReasonType == "Random",
              !ele.rateb.rateb.Unit?.isSpecial
            );
          })[0];
        }
        let transCan = finalAllocation.findIndex(
          ele => ele.RatebID == cand.bestRatebDetails.rateb.ID
        );

        let swapperCan = finalAllocation.findIndex(
          ele => ele.RatebID == swapper.RatebID
        );

        let temp = finalAllocation[swapperCan].TransferedToUnitId;
        let temp2 = finalAllocation[transCan].TransferedToUnitId;

        finalAllocation[transCan].TransferedToUnitId = temp;
        finalAllocation[transCan].DecisionNotes =
          "لأنها ليست وحدته السابقة - - لأنها ليست من إتجاهاته السابقة  - - تم دخولهم المرحلة الثانية من التوزيع";

        finalAllocation[swapperCan].TransferedToUnitId = temp2;

        finalAllocation[swapperCan].DecisionNotes =
          "لأنها ليست وحدته السابقة - - لأنها ليست من إتجاهاته السابقة  - - تم دخولهم المرحلة الثانية من التوزيع";

        finalAllocation[transCan].ReasonType = "level2";

        finalAllocation[swapperCan].ReasonType = "level2";
      }
    }

    console.log("unitsRelated", unitsRelated, improvedCands);

    return { finalAllocation, errors };
  }
};
