import type { NegativeGradeColoring } from "@/contexts/UserPreferencesContext";
import type { GradeFrac } from "@/units";

export class GradeColors {
    static readonly maxAbsGrade = 0.2;

    static getColorForGrade(gradeFrac: GradeFrac, negativeGradeColoring: NegativeGradeColoring): string {
        let grade = gradeFrac as number;
        let colorStr = "";
        if (grade < 0 && negativeGradeColoring === "singleColor") {
            colorStr = "hsl(0, 0%, 50%)";
        } else {
            if (negativeGradeColoring === "mirrorPositiveGrade" && grade < 0) {
                grade = -grade;
            }
            grade = (Math.sign(grade) * Math.abs(grade) ** 0.85) / (this.maxAbsGrade ** 0.85 / this.maxAbsGrade);
            grade = Math.min(this.maxAbsGrade, Math.max(negativeGradeColoring === "mirrorPositiveGrade" ? 0 : -this.maxAbsGrade, grade));
            const p1 = (grade / this.maxAbsGrade) * 2;
            const p2 = p1 > 1 ? p1 - 1 : 0;

            const color = {
                h: 90 - 90 * Math.min(1, p1),
                s: 100,
                l: 50 - p2 * 50,
            };
            colorStr = `hsl(${color.h}, ${color.s}%, ${color.l}%)`;
        }
        return colorStr;
    }
}
