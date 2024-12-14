import { Grid, Paper, Box } from "@mui/material";
import ClickGraph from "./Charts/LineGraph-clicks";
import DuelPieGraphs from "./Charts/DuelPieChart-clicks";
import BarGraph from "./Charts/BarGraph-clicks";
import AiResponseComponent from "./Charts/aiResponse";
import { userDataAtom } from "../../state/Atoms";
import { useAtom } from "jotai";
import { mapUserData } from "../../services/extractData";
import RadarChart from "./Charts/RadarGraph-clicks";
import StackedBarChart from "./Charts/StackedBarGraph-clicks";

const AllUserData = () => {
  const [userData] = useAtom(userDataAtom);
  const mappedData = mapUserData(userData);

  return (
    <Box sx={{ padding: 6 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
      
          >
            <ClickGraph data={mappedData} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              height: "100%",
             
            }}
          >
            <DuelPieGraphs
              data={mappedData}
              keyword={"user_browser"}
              keywordTwo={"user_os"}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
       
          >
            <StackedBarChart
              data={mappedData}
              keyword={"user_browser"}
              keywordTwo={"user_os"}
            />
          </Paper>
        </Grid>
       <Grid item xs={12} md={4.4}>
          <Paper
            elevation={3}
      
          >
            <RadarChart
              data={mappedData}
              keyword={"website"}
              keywordTwo={"user_browser"}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={7.6}>
          <Paper
            elevation={3}
      
          >
            <BarGraph data={mappedData} keyword={"website"} />
          </Paper>
        </Grid>

 

        <Grid container justifyContent="flex-end">
  <Grid item xs={12} md={7.45} sx={{ mt: -5 }}>
    <Paper
      elevation={3}
   
    >
      <AiResponseComponent />
    </Paper>
  </Grid>
</Grid>


      </Grid>
    </Box>
  );
};

export default AllUserData;
