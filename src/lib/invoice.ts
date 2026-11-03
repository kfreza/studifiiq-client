import { cs_formatBookingDate, cs_formatDate, cs_formatMoney } from "@/lib/format";
import type { CsBooking } from "@/lib/types";

const CS_BLUE: [number, number, number] = [43, 63, 208];
const CS_INK: [number, number, number] = [22, 24, 29];
const CS_MUTED: [number, number, number] = [91, 98, 112];

// build and download a pdf invoice
export async function cs_downloadInvoice(booking: CsBooking) {
  const { jsPDF } = await import("jspdf");
  const cs_doc = new jsPDF({ unit: "pt", format: "a4" });
  const cs_width = cs_doc.internal.pageSize.getWidth();
  const cs_left = 48;
  const cs_right = cs_width - 48;
  const cs_number = `SS-${booking._id.slice(-6).toUpperCase()}`;

  // header band
  cs_doc.setFillColor(...CS_BLUE);
  cs_doc.rect(0, 0, cs_width, 96, "F");
  cs_doc.setTextColor(255, 255, 255);
  cs_doc.setFont("helvetica", "bold");
  cs_doc.setFontSize(24);
  cs_doc.text("StudioSpace", cs_left, 56);
  cs_doc.setFont("helvetica", "normal");
  cs_doc.setFontSize(11);
  cs_doc.text("Booking invoice", cs_right, 50, { align: "right" });
  cs_doc.text(cs_number, cs_right, 66, { align: "right" });

  // meta
  let cs_y = 140;
  const cs_label = (text: string, x: number, y: number) => {
    cs_doc.setFont("helvetica", "normal");
    cs_doc.setFontSize(9);
    cs_doc.setTextColor(...CS_MUTED);
    cs_doc.text(text, x, y);
  };
  const cs_value = (text: string, x: number, y: number, bold = false) => {
    cs_doc.setFont("helvetica", bold ? "bold" : "normal");
    cs_doc.setFontSize(11);
    cs_doc.setTextColor(...CS_INK);
    cs_doc.text(text, x, y);
  };

  cs_label("BILLED TO", cs_left, cs_y);
  cs_value(booking.userName, cs_left, cs_y + 16, true);
  cs_value(booking.userEmail, cs_left, cs_y + 32);

  cs_label("ISSUED", 330, cs_y);
  cs_value(cs_formatDate(new Date()), 330, cs_y + 16);
  cs_label("STATUS", 450, cs_y);
  cs_value(booking.status, 450, cs_y + 16, true);

  cs_y += 76;
  cs_label("STUDIO", cs_left, cs_y);
  cs_value(booking.studioTitle, cs_left, cs_y + 16, true);
  cs_value(booking.studioLocation, cs_left, cs_y + 32);
  cs_value(`Hosted by ${booking.hostName}`, cs_left, cs_y + 48);

  cs_label("SESSION", 330, cs_y);
  cs_value(cs_formatBookingDate(booking.date), 330, cs_y + 16);
  cs_value(`${booking.startTime} to ${booking.endTime} (${booking.hours} h)`, 330, cs_y + 32);

  // line items
  cs_y += 96;
  cs_doc.setDrawColor(217, 221, 227);
  cs_doc.line(cs_left, cs_y, cs_right, cs_y);
  cs_label("DESCRIPTION", cs_left, cs_y + 20);
  cs_doc.text("AMOUNT", cs_right, cs_y + 20, { align: "right" });

  const cs_rows: [string, string][] = [
    [`Studio hire, ${booking.hours} h x ${cs_formatMoney(booking.hourlyRate)}`, cs_formatMoney(booking.subtotal)],
    ["Security deposit (refundable after the session)", cs_formatMoney(booking.securityDeposit)],
  ];
  cs_y += 44;
  cs_rows.forEach(([text, amount]) => {
    cs_value(text, cs_left, cs_y);
    cs_doc.text(amount, cs_right, cs_y, { align: "right" });
    cs_y += 26;
  });

  cs_doc.line(cs_left, cs_y - 8, cs_right, cs_y - 8);
  cs_y += 14;
  cs_doc.setFont("helvetica", "bold");
  cs_doc.setFontSize(14);
  cs_doc.setTextColor(...CS_INK);
  cs_doc.text("Total", cs_left, cs_y);
  cs_doc.setTextColor(...CS_BLUE);
  cs_doc.text(cs_formatMoney(booking.totalPrice), cs_right, cs_y, { align: "right" });

  // footer
  cs_doc.setFont("helvetica", "normal");
  cs_doc.setFontSize(9);
  cs_doc.setTextColor(...CS_MUTED);
  cs_doc.text(
    "Thank you for booking with StudioSpace. Questions about this booking? Contact your host or support@studiospace.dev.",
    cs_left,
    cs_doc.internal.pageSize.getHeight() - 48
  );

  cs_doc.save(`StudioSpace-invoice-${cs_number}.pdf`);
}
