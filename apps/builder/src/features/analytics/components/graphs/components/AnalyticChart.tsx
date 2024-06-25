
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement, ArcElement } from 'chart.js';



ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement
);





{/* // eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore */ }
export const AnalyticChart = ({ data }) => {
  console.log("analytic chart callled", data)
  // const ratingInputData = data.filter(item => item.inputs.some(input => input.type === "rating input"));

  // const choiceInputData = data.filter(item => item.inputs.some(input => input.type === "choice input"));

  // const ratingCharts = ratingInputData.map(item => {
  //   const ratings = item.inputs[1].total[0].map(rating => parseInt(rating.rating));
  //   const total = item.inputs[1].total[0].map(rating => parseInt(rating.total));
  //   const title = item.inputs[0].content.richText[0].children[0].text;

  //   const chartData = {
  //     labels: ratings,
  //     datasets: [{
  //       label: title,
  //       data: total,
  //       backgroundColor: 'rgba(255, 159, 64, 0.6)'
  //     }]
  //   };

  //   return (
  //     <div key={item.groupId}>
  //       <h3>{title}</h3>
  //       <Bar data={chartData} />
  //     </div>
  //   );
  // });

  // const choiceCharts = choiceInputData.map(item => {
  //   const labels = item.inputs[1].items.map(choice => choice.content);
  //   const total = item.inputs[1].total[0].map(choice => parseInt(choice.total));
  //   const title = item.inputs[0].content.richText[0].children[0].text;

  //   const chartData = {
  //     labels: labels,
  //     datasets: [{
  //       label: title,
  //       data: total,
  //       backgroundColor: 'rgba(255, 159, 64, 0.6)'
  //     }]
  //   };

  //   return (
  //     <div key={item.groupId}>
  //       <h3>{title}</h3>
  //       <Bar data={chartData} />
  //     </div>
  //   );
  // });
  // const charts = [...ratingCharts, ...choiceCharts];


  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore

  // chart for choice input and rating

  const charts = Array.isArray(data) && data.map(group => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (group.inputs.some(input => input.type === "rating input")) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const ratingInput = group.inputs.find(input => input.type === "rating input");

      console.log("rating inputt", ratingInput)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const total = ratingInput.total[0].map(entry => ({
        rating: parseInt(entry.rating),
        total: parseInt(entry.total)
      }));
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const title = group.inputs.find(input => input.type === "text")?.content?.richText[0]?.children[0]?.text;




      // Calculate NPS
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const detractors = total.filter(entry => entry.rating >= 0 && entry.rating <= 6).reduce((acc, curr) => acc + curr.total, 0);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const promoters = total.filter(entry => entry.rating >= 9 && entry.rating <= 10).reduce((acc, curr) => acc + curr.total, 0);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const totalResponses = total.reduce((acc, curr) => acc + curr.total, 0);

      // console.log('Total responses:', totalResponses);
      // console.log('Promoters:', promoters);
      // console.log('Detractors:', detractors);

      // rating scale for 5
      console.log("rating optionss", ratingInput.options.length)

      const ratingLength = ratingInput.options.length


      // console.log("rating inputttttttts", ratingLength)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const detractorsRatingScaleFive = total.filter(entry => entry.rating >= 0 && entry.rating <= 2).reduce((acc, curr) => acc + curr.total, 0);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const promotersRatingScaleFive = total.filter(entry => entry.rating >= 4 && entry.rating <= 5).reduce((acc, curr) => acc + curr.total, 0);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const totalResponsesRatingScaleFive = total.reduce((acc, curr) => acc + curr.total, 0);

      const ratings = Array.from({ length: ratingLength + 1 }, (_, i) => i)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const totalMap = new Map(ratingInput.total[0].map(item => [parseInt(item.rating), item.total]))
      const totals = ratings.map(rating => totalMap.get(rating) || 0)

      console.log("ratings for all", totalMap)

      let npsScaleFive;
      if (!isNaN(totalResponses) && totalResponses !== 0) {
        npsScaleFive = ((promotersRatingScaleFive - detractorsRatingScaleFive) / totalResponsesRatingScaleFive) * 100;
      } else {
        npsScaleFive = 0; // Handle case where there are no responses or NaN
      }

      console.log("rating scale five", npsScaleFive)


      let nps;
      if (!isNaN(totalResponses) && totalResponses !== 0) {
        nps = ((promoters - detractors) / totalResponses) * 100;
      } else {
        nps = 0; // Handle case where there are no responses or NaN
      }

      console.log('NPS:', nps);

      const chartData = {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // labels: total.map(entry => entry.rating),
        labels: ratings,
        datasets: [{
          label: `NPS: ${ratingLength === 5 ? npsScaleFive.toFixed(2) : nps.toFixed(2)}%`,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          // data: total.map(entry => entry.total),
          data: totals,
          // data: ratings,
          backgroundColor: 'rgba(255, 159, 64, 0.8)'
        }]
      };

      return (
        <div key={group.groupId}>
          {totalResponses > 0 ? <>
            <h3>{title ? title : group.title}</h3>
            <Bar data={chartData} />
          </> : ''}
        </div>
      );
    } else if (
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      group.inputs.some(input => input.type === "choice input")) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const choiceInput = group.inputs.find(input => input.type === "choice input");
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // const labels = choiceInput.items.map(choice => choice.content);
      const itemsWithTotals = choiceInput.items.map(choice => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const totalEntry = choiceInput.total[0].find(entry => entry.content === choice.content);
        return {
          label: choice.content,
          total: totalEntry ? parseInt(totalEntry.total) : 0

        };
      });
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const labels = itemsWithTotals.map(item => item.label);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const totals = itemsWithTotals.map(item => item.total);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const checkAnyMultipleValueSelected = choiceInput.total[0].map(choice => parseInt(choice.total));
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const title = group.inputs.find(input => input.type === "text")?.content?.richText[0]?.children[0]?.text;

      const chartData = {
        labels: labels,
        datasets: [{
          label: title ? title : group.title,
          data: totals,
          backgroundColor: 'rgba(255, 159, 64, 0.8)'
        }]
      };
      // console.log("total choicesssssssssssssssssss", checkAnyMultipleValueSelected.length)
      return (
        <div key={group.groupId}>
          {checkAnyMultipleValueSelected.length ?
            <><h3 >{title ? title : group.title}</h3>
              <Bar data={chartData} />
            </> : ''}

        </div>
      );
    }
    else if (
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      group.inputs.some(input => input.type === "card input")) {

      // const cardInput = group.inputs.find(input => input.type === "card input");
      // console.log("card inputtt", cardInput)
      // const title = cardInput.children.map((item) => item.label)
      // const ratingInput = cardInput.options.inputs.find(input => input.type === "rating");

      // const total = cardInput.children[0].total.map(entry => ({
      //   rating: parseInt(entry.rating),
      //   total: parseInt(entry.total)
      // }));


      // console.log("total inputt", total)
      // // const total = cardInput.children.total.map(entry => ({
      // //   rating: parseInt(entry.rating),
      // //   total: parseInt(entry.total)
      // // }));

      // // const total = totalinp.total.map(entry => ({
      // //   rating: parseInt(entry.rating),
      // //   total: parseInt(entry.total)
      // // }))
      // console.log("totallll", cardInput.children)
      // const detractors = total.filter(entry => entry.rating >= 0 && entry.rating <= 6).reduce((acc, curr) => acc + curr.total, 0);
      // const promoters = total.filter(entry => entry.rating >= 9 && entry.rating <= 10).reduce((acc, curr) => acc + curr.total, 0);
      // const totalResponses = total.reduce((acc, curr) => acc + curr.total, 0);

      // const ratingLength = ratingInput.length;

      // const detractorsRatingScaleFive = total.filter(entry => entry.rating >= 0 && entry.rating <= 2).reduce((acc, curr) => acc + curr.total, 0);
      // const promotersRatingScaleFive = total.filter(entry => entry.rating >= 4 && entry.rating <= 5).reduce((acc, curr) => acc + curr.total, 0);
      // const totalResponsesRatingScaleFive = total.reduce((acc, curr) => acc + curr.total, 0);

      // const ratings = Array.from({ length: ratingLength + 1 }, (_, i) => i);
      // const totalMap = new Map(cardInput.children[0].total.map(item => [parseInt(item.rating), item.total]));
      // const totals = ratings.map(rating => totalMap.get(rating) || 0);

      // let npsScaleFive;
      // if (!isNaN(totalResponsesRatingScaleFive) && totalResponsesRatingScaleFive !== 0) {
      //   npsScaleFive = ((promotersRatingScaleFive - detractorsRatingScaleFive) / totalResponsesRatingScaleFive) * 100;
      // } else {
      //   npsScaleFive = 0; // Handle case where there are no responses or NaN
      // }

      // let nps;
      // if (!isNaN(totalResponses) && totalResponses !== 0) {
      //   nps = ((promoters - detractors) / totalResponses) * 100;
      // } else {
      //   nps = 0; // Handle case where there are no responses or NaN
      // }

      // const chartData = {
      //   labels: ratings,
      //   datasets: [{
      //     label: `NPS: ${ratingLength === 5 ? npsScaleFive.toFixed(2) : nps.toFixed(2)}%`,
      //     data: totals,
      //     backgroundColor: 'rgba(255, 159, 64, 0.8)'
      //   }]
      // };

      // return (
      //   <div key={group.groupId}>
      //     {totalResponses > 0 && (
      //       <>
      //         <h3>{title ? title : group.title}</h3>
      //         <Bar data={chartData} />
      //       </>
      //     )}
      //   </div>
      // );
      const cardInput = group.inputs.find(input => input.type === "card input");
      const ratingInput = cardInput.options.inputs.find(input => input.type === "rating");
      // const ratingLength = ratingInput.length;
      let ratingLength;
      const cardRatingLengths = cardInput.options.inputs.map(input => {
        if (input.type === "rating") {
          return input.length
        }
      }).filter((item) => item != undefined);

      // const ratingLength = cardRatingLengths


      console.log("input lengthhh", cardRatingLengths)
      // Initialize variables for NPS calculations
      let totalResponses = 0;
      let promoters = 0;
      let detractors = 0;

      console.log("totalresponses for input card", totalResponses)

      // for rating scale 5
      let totalResponsesScaleFive = 0;
      let promotersScaleFive = 0;
      let detractorsScaleFive = 0;

      // Calculate NPS for the card input ratings
      const ratingsData = cardInput.children.map(child => {
        const ratingLabel = child.label;
        const totalEntries = child.total;

        console.log("total entriess", totalEntries)
        ratingLength = child.length
        // Calculate total responses for this specific rating
        // const totalRatingResponses = totalEntries.reduce((acc, entry) => acc + entry.total, 0);
        // totalResponses += totalRatingResponses;
        const totalRatingResponses = totalEntries.reduce((acc, entry) => acc + entry.total, 0);
        totalResponses += totalRatingResponses;

        // Calculate promoters and detractors
        const ratingPromoters = totalEntries.filter(entry => entry.rating >= 9 && entry.rating <= 10).reduce((acc, entry) => acc + entry.total, 0);
        const ratingDetractors = totalEntries.filter(entry => entry.rating >= 0 && entry.rating <= 6).reduce((acc, entry) => acc + entry.total, 0);
        promoters += ratingPromoters;
        detractors += ratingDetractors;
        console.log("rating promoterrrr", ratingPromoters)
        console.log("rating detracterss", ratingDetractors)

        console.log("Total promoters so far:", promoters);
        console.log("Total detractors so far:", detractors);



        // Calculate total responses for this specific rating
        const totalResponsesScale = totalEntries.reduce((acc, entry) => acc + entry.total, 0);
        totalResponsesScaleFive += totalResponsesScale;

        // Calculate promoters and detractors
        const ratingPromotersScaleFive = totalEntries.filter(entry => entry.rating >= 4 && entry.rating <= 5).reduce((acc, entry) => acc + entry.total, 0);
        const ratingDetractorsScaleFive = totalEntries.filter(entry => entry.rating >= 0 && entry.rating <= 2).reduce((acc, entry) => acc + entry.total, 0);
        promotersScaleFive += ratingPromotersScaleFive;
        detractorsScaleFive += ratingDetractorsScaleFive;
        console.log("rating scale five promoterrrr", ratingPromotersScaleFive)
        console.log("rating scale five detracterss", ratingDetractorsScaleFive)


        const ratings = Array.from({ length: ratingLength + 1 }, (_, i) => i);
        const totalMap = new Map(totalEntries.map(item => [parseInt(item.rating), item.total]));
        const totals = ratings.map(rating => totalMap.get(rating) || 0);

        return {
          label: ratingLabel,
          // ratings: totalEntries.map(entry => parseInt(entry.rating)),
          ratings: ratings,
          totals: totals
        };
      });

      // Calculate overall NPS for the group
      let nps;
      if (!isNaN(totalResponses) && totalResponses !== 0) {
        nps = ((promoters - detractors) / totalResponses) * 100;
      } else {
        nps = 0; // Handle case where there are no responses or NaN
      }

      // nps for rating scale 5
      let npsScaleFives;
      if (!isNaN(totalResponsesScaleFive) && totalResponsesScaleFive !== 0) {
        npsScaleFives = ((promotersScaleFive - detractorsScaleFive) / totalResponsesScaleFive) * 100;
      } else {
        nps = 0; // Handle case where there are no responses or NaN
      }

      // Prepare chart data for each set of ratings
      const chartsData = ratingsData.map(ratingData => {
        const chartData = {
          labels: ratingData.ratings,
          datasets: [{
            label: `NPS: ${ratingLength === 5 ? npsScaleFives.toFixed(2) : nps.toFixed(2)}%`,
            data: ratingData.totals,
            backgroundColor: 'rgba(255, 159, 64, 0.8)'
          }]
        };

        return (
          <div key={`${group.groupId}-${ratingData.label}`}>
            <h3>{ratingData.label}</h3>
            <Bar data={chartData} />
          </div>
        );
      });

      return chartsData;

    }

    else {
      return null; // Handle other types of inputs if necessary
    }
  });


  // const charts = data && data.map(group => {
  //   if (group.inputs.some(input => input.type === "rating input")) {
  //     const ratingInput = group.inputs.find(input => input.type === "rating input");
  //     const ratings = ratingInput.total[0].map(rating => parseInt(rating.rating));
  //     const total = ratingInput.total[0].map(rating => parseInt(rating.total));
  //     const title = group.inputs.find(input => input.type === "text")?.content?.richText[0]?.children[0].text;





  //     const chartData = {
  //       labels: ratings,
  //       datasets: [{
  //         label: `NPS: $`,
  //         data: total,
  //         backgroundColor: 'rgba(255, 159, 64, 0.6)'
  //       }]
  //     };

  //     return (
  //       <div key={group.groupId}>
  //         <h3>{title}</h3>
  //         <Bar data={chartData} />
  //       </div>
  //     );
  //   } else if (group.inputs.some(input => input.type === "choice input")) {
  //     const choiceInput = group.inputs.find(input => input.type === "choice input");
  //     const labels = choiceInput.items.map(choice => choice.content);
  //     const total = choiceInput.total[0].map(choice => parseInt(choice.total));
  //     const title = group.inputs.find(input => input.type === "text")?.content?.richText[0]?.children[0].text;

  //     const chartData = {
  //       labels: labels,
  //       datasets: [{
  //         label: title,
  //         data: total,
  //         backgroundColor: 'rgba(255, 159, 64, 0.6)'
  //       }]
  //     };

  //     return (
  //       <div key={group.groupId}>
  //         <h3>{title}</h3>
  //         <Bar data={chartData} />
  //       </div>
  //     );
  //   } else {
  //     return null; // Handle other types of inputs if necessary
  //   }
  // });


  return (

    <div style={{ display: 'flex', marginTop: '10%', justifyContent: 'center', alignItems: 'center', gap: '25px', flexWrap: 'wrap', height: '70%', overflowY: 'auto' }}>
      {/* {renderCharts()} */}
      {charts}
    </div>

  );
};

