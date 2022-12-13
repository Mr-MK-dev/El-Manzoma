import Vue from "vue";

Vue.mixin({
  methods: {
    allocatedTransferedData(unitsPreparedData, candidates) {
      let finalAllocation = [];

      let recommended = candidates.filter(ele => ele.recommendation);

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
            candidates.splice(candidates.indexOf(recommended[i]), 1);

            finalAllocation.push({
              RatebID: recommended[i].ID,
              TransferedToUnitId: selectedUnitOfRecommendation.unitID,
              ReasonType: "Recommendation",
              ReasonId: recommended[i].recommendation.ID_KEY,
              DecisionNotes: "تم توزيع هذا الفرد بناءا على التوصية الموجودة"
            });
            unitsPreparedData
              .find(ele => ele.unitID == selectedUnitOfRecommendation.unitID)
              .slots.find(ele => ele.category == recommended[i].category)
              .count--;
          }
        }
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
            candidates.splice(candidates.indexOf(requested[i]), 1);
            finalAllocation.push({
              RatebID: requested[i].ID,
              TransferedToUnitId: selectedUnitOfRequest.unitID,
              ReasonType: "Request",
              ReasonId: requested[i].request.ID_KEY,
              DecisionNotes: "تم توزيع هذا الفرد بناءا على الالتماس الموجود"
            });
            unitsPreparedData
              .find(ele => ele.unitID == selectedUnitOfRequest.unitID)
              .slots.find(ele => ele.category == requested[i].category).count--;
          }
        }
      }

      let validateRecommendationsBasedOnUnitIdAndCategory = (
        selectedCandidates,
        currentUnit
      ) => {
        for (let i = 0; i < selectedCandidates.length; i++) {
          if (
            selectedCandidates[i].recommendation &&
            selectedCandidates[i].recommendation.RecommendedUnitID ==
              currentUnit.unitID
          ) {
            candidates.splice(candidates.indexOf(selectedCandidates[i]), 1);
            finalAllocation.push({
              RatebID: selectedCandidates[i].ID,
              TransferedToUnitId: currentUnit.unitID,
              ReasonType: "Recommendation",
              ReasonId: selectedCandidates[i].recommendation.ID_KEY,
              DecisionNotes: "تم توزيع هذا الفرد بناءا على التوصية الموجودة"
            });

            return true;
          }
        }
        return false;
      };
      let validateRequestsBasedOnUnitIdAndCategory = (
        selectedCandidates,
        currentUnit
      ) => {
        for (let i = 0; i < selectedCandidates.length; i++) {
          if (
            selectedCandidates[i].request &&
            selectedCandidates[i].request.RecommendedUnitID ==
              currentUnit.unitID &&
            selectedCandidates[i].request.isCertified
          ) {
            candidates.splice(candidates.indexOf(selectedCandidates[i]), 1);
            finalAllocation.push({
              RatebID: selectedCandidates[i].ID,
              TransferedToUnitId: currentUnit.unitID,
              ReasonType: "Requests",
              ReasonId: selectedCandidates[i].request.ID_KEY,
              DecisionNotes: "تم توزيع هذا الفرد بناءا على الالتماس الموجودة"
            });
            return true;
          }
        }
        return false;
      };

      let validateInNotPreUnits = (selectedCandidates, currentUnit) => {
        for (let i = 0; i < selectedCandidates.length; i++) {
          if (
            !selectedCandidates[i].preuints
              .map(ele => ele.uintid)
              .includes(currentUnit.unitID) &&
            currentUnit.unitID != selectedCandidates[i].UnitID
          ) {
            // console.log(currentUnit);
            candidates.splice(candidates.indexOf(selectedCandidates[i]), 1);
            finalAllocation.push({
              RatebID: selectedCandidates[i].ID,
              TransferedToUnitId: currentUnit.unitID,
              ReasonType: "PreUnits",
              ReasonId: null,
              DecisionNotes:
                "تم توزيع هذا الفرد بناءا على انه لم يكن في هذه الوحدة من قبل "
            });
            return true;
          }
        }
        return false;
      };

      let rules = [
        validateRecommendationsBasedOnUnitIdAndCategory,
        validateRequestsBasedOnUnitIdAndCategory,
        validateInNotPreUnits
      ];
      for (let i = 0; i < unitsPreparedData.length; i++) {
        for (let j = 0; j < unitsPreparedData[i].slots.length; j++) {
          let ruleIndex = 0;

          while (unitsPreparedData[i].slots[j].count > 0) {
            let availableCandidates = candidates.filter(
              ele => ele.category == unitsPreparedData[i].slots[j].category
            );
            if (rules[ruleIndex](availableCandidates, unitsPreparedData[i])) {
              unitsPreparedData[i].slots[j].count--;
              ruleIndex = 0;
            } else {
              ruleIndex++;
            }
          }
        }
      }

      return finalAllocation;
    }
    // allocatedTransferedData(unitsPreparedData, candidates) {
    //   let finalAllocation = [];
    //
    //   let recommended = candidates.filter(ele => ele.recommendation != null);
    //
    //   for (let i = 0; i < recommended.length; i++) {
    //     if (
    //       unitsPreparedData[
    //         unitsPreparedData.indexOf(
    //           ele => ele.unitID === recommended[i].RecommendedUnitID
    //         )
    //       ]
    //     ) {
    //       if (
    //         unitsPreparedData[
    //           unitsPreparedData.indexOf(
    //             ele => ele.unitID === recommended[i].RecommendedUnitID
    //           )
    //         ].slots[
    //           slots.indexOf(ele => ele.category == recommended[i].category)
    //         ] &&
    //         unitsPreparedData[
    //           unitsPreparedData.indexOf(
    //             ele => ele.unitID === recommended[i].RecommendedUnitID
    //           )
    //         ].slots[
    //           slots.indexOf(ele => ele.category == recommended[i].category)
    //         ].count > 0
    //       ) {
    //         candidates.splice(candidates.indexOf(recommended[i]), 1);
    //         finalAllocation.push({
    //           RatebID: recommended[i].ID,
    //           TransferedToUnitId:
    //             unitsPreparedData[
    //               unitsPreparedData.indexOf(
    //                 ele => ele.unitID === recommended[i].RecommendedUnitID
    //               )
    //             ].unitID,
    //           ReasonType: "Recommendation",
    //           ReasonId: recommended[i].recommendation.ID_KEY,
    //           DecisionNotes: "تم توزيع هذا الفرد بناءا على التوصية الموجودة"
    //         });
    //         unitsPreparedData[
    //           unitsPreparedData.indexOf(
    //             ele => ele.unitID === recommended[i].RecommendedUnitID
    //           )
    //         ].slots[
    //           slots.indexOf(ele => ele.category == recommended[i].category)
    //         ].count--;
    //       }
    //     }
    //   }
    //   let requested = candidates.filter(
    //     ele => ele.request != null && ele.request.isCertified
    //   );
    //   for (let i = 0; i < requested.length; i++) {
    //     if (
    //       unitsPreparedData[
    //         unitsPreparedData.indexOf(
    //           ele => ele.unitID === requested[i].RecommendedUnitID
    //         )
    //       ]
    //     ) {
    //       if (
    //         unitsPreparedData[
    //           unitsPreparedData.indexOf(
    //             ele => ele.unitID === requested[i].RecommendedUnitID
    //           )
    //         ].slots[
    //           slots.indexOf(ele => ele.category == requested[i].category)
    //         ] &&
    //         unitsPreparedData[
    //           unitsPreparedData.indexOf(
    //             ele => ele.unitID === requested[i].RecommendedUnitID
    //           )
    //         ].slots[slots.indexOf(ele => ele.category == requested[i].category)]
    //           .count > 0
    //       ) {
    //         candidates.splice(candidates.indexOf(requested[i]), 1);
    //         finalAllocation.push({
    //           RatebID: requested[i].ID,
    //           TransferedToUnitId:
    //             unitsPreparedData[
    //               unitsPreparedData.indexOf(
    //                 ele => ele.unitID === requested[i].RecommendedUnitID
    //               )
    //             ].unitID,
    //           ReasonType: "Request",
    //           ReasonId: requested[i].request.ID_KEY,
    //           DecisionNotes: "تم توزيع هذا الفرد بناءا على الالتماس الموجودة"
    //         });
    //         unitsPreparedData[
    //           unitsPreparedData.indexOf(
    //             ele => ele.unitID === requested[i].RecommendedUnitID
    //           )
    //         ].slots[slots.indexOf(ele => ele.category == requested[i].category)]
    //           .count--;
    //       }
    //     }
    //   }
    //
    //   for (let i = 0; i < candidates.length; i++) {
    //     let suitableUnit = unitsPreparedData
    //       .filter(
    //         ele =>
    //           ele.unitID != candidates[i].UnitID &&
    //           !candidates[i].preuints.map(e => e.unitId).includes(ele.unitID) &&
    //           ele.slots.map(x => x.category).includes(candidates[i].category) &&
    //           ele.slots[ele.slots.indexOf(y => y.count > 0)]
    //       )
    //       [0];
    //
    //     if (suitableUnit) {
    //       console.log(suitableUnit);
    //       candidates.splice(candidates.indexOf(candidates[i]), 1);
    //       finalAllocation.push({
    //         RatebID: candidates[i].ID,
    //         TransferedToUnitId: suitableUnit.unitID,
    //         ReasonType: "PreUnits",
    //         ReasonId: null,
    //         DecisionNotes:
    //           "تم توزيع هذا الفرد بناءا على انه لم يكن في هذه الوحدة من قبل "
    //       });
    //     }
    //   }
    //
    //   return finalAllocation;
    // }
  }
});
