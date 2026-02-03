
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const checkDate = (input: any) => {
    try {
        const date = new Date(input);
        console.log(`Input: ${input}, Date Invalid? ${isNaN(date.getTime())}`);
        
        console.log("Formatting (date-fns)...");
        console.log(format(date, "MMMM", { locale: ptBR }));

        console.log("Formatting (Intl)...");
        console.log(new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Sao_Paulo", day: "2-digit" }).format(date));
        
    } catch (e: any) {
        console.error("CRASHED:", e.message);
    }
};

console.log("--- Testing Valid Date ---");
checkDate("2024-02-05T10:00:00Z");

console.log("\n--- Testing Invalid Date String ---");
checkDate("not-a-date");

console.log("\n--- Testing Null ---");
checkDate(null);

console.log("\n--- Testing Undefined ---");
checkDate(undefined);
