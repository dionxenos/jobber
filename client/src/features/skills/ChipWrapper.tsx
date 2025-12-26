import { Chip, SxProps } from "@mui/material";

interface Props {
  label: string;
  deleteIcon?: any;
  color: any;
  sx: SxProps;
  handleDelete: () => void;
}

export default function ChipWrapper({
  label,
  deleteIcon,
  color,
  sx,
  handleDelete,
}: Props) {
  return (
    <Chip
      label={label}
      onDelete={handleDelete}
      deleteIcon={deleteIcon}
      color={color}
      sx={sx}
    />
  );
}
