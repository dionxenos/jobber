import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
} from "@mui/material";
import { Language } from "../../app/models/interfaces";

interface Props {
  languages: Language[];
}

const langHeaders = ["Code", "Name", "Level"];

export default function UserLanguages({ languages }: Props) {
  return (
    <TableContainer component="div">
      <Table>
        <TableHead>
          <TableRow>
            {langHeaders.map((h) => (
              <TableCell key={h} align="left">
                {h}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {languages &&
            languages.map((lang) => (
              <TableRow
                key={lang.code}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                <TableCell align="left">{lang.code}</TableCell>
                <TableCell align="left" sx={{ fontWeight: "bold" }}>
                  {lang.name}
                </TableCell>
                <TableCell align="left">
                  <Chip
                    label={lang.level}
                    sx={{
                      backgroundColor: "secondary.dark",
                      color: "white",
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
