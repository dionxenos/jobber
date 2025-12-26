import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
} from "@mui/material";
import { Education } from "../../app/models/interfaces";

interface Props {
  education: Education[];
}

const eduHeaders = ["Name", "Level", "From", "To"];

export default function UserEducation({ education }: Props) {
  return (
    <TableContainer component="div">
      <Table>
        <TableHead>
          <TableRow>
            {eduHeaders.map((h) => (
              <TableCell key={h} align="left">
                {h}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {education &&
            education.map((edu) => (
              <TableRow
                key={edu.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                <TableCell align="left" sx={{ fontWeight: "bold" }}>
                  {edu.name}
                </TableCell>
                <TableCell align="left">
                  <Chip
                    label={edu.level}
                    sx={{
                      backgroundColor: "secondary.dark",
                      color: "white",
                    }}
                  />
                </TableCell>
                <TableCell align="left">{edu.from}</TableCell>
                <TableCell align="left">{edu.to}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
