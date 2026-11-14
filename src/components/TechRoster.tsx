import { countGroup, type TechData, type TechGroup, type TechStats, type TechSub } from "../data/roster";
import { AccentLabel, ChipRows } from "./blocks";
import { Countdown } from "./Countdown";
import { PosterFooter } from "./PosterFooter";
import { PosterHeader } from "./PosterHeader";

/** 卡宽减去描边、内边距、年级标签和标签间距。 */
const chipsBoxWidth = (cardWidth: number) => cardWidth - 90;

function ChipLine({ grade, names, strong, boxWidth }: {
    grade: string;
    names: string[];
    strong: boolean;
    boxWidth: number;
}) {
    if (!names.length) return null;
    return (
        <div className="tech-grade" data-gradeline={grade}>
            <span className="tech-grade-label text-meta font-medium tracking-[1px] text-dim">{grade}</span>
            <ChipRows names={names} strong={strong} boxWidth={boxWidth} />
        </div>
    );
}

function SubBlock({ sub, group, boxWidth }: {
    sub: TechSub;
    group: TechGroup;
    boxWidth: number;
}) {
    const single = group.subs.length === 1 && sub.name === group.name;
    return (
        <div className={`tech-sub ${single ? "tech-sub-single" : ""}`} data-sub={sub.name}>
            {!single && (
                <div className="tech-sub-title">
                    <AccentLabel accent={group.accent}>{sub.name}</AccentLabel>
                    <span className="text-meta tracking-[0.5px] text-dim">{sub.g3.length + sub.g2.length} 人</span>
                </div>
            )}
            <div className="tech-sub-grades">
                <ChipLine grade="大三" names={sub.g3} strong boxWidth={boxWidth} />
                <ChipLine grade="大二" names={sub.g2} strong={false} boxWidth={boxWidth} />
            </div>
        </div>
    );
}

function TechCard({ group }: { group: TechGroup }) {
    const { g3, g2 } = countGroup(group);
    const boxWidth = chipsBoxWidth(group.width);
    return (
        <section
            data-card
            className="tech-card relative flex min-w-0 flex-col overflow-hidden rounded-card border bg-[linear-gradient(180deg,var(--color-card-top)_0%,var(--color-card-bottom)_100%)] shadow-[0_14px_34px_rgba(0,0,0,.38)]"
            style={{ flex: `0 0 ${group.width}px`, borderColor: group.border }}
        >
            <header className="tech-card-head" style={{ background: group.accent }}>
                <div className="flex items-center justify-between gap-[12px]">
                    <span className="text-cardtitle font-bold tracking-[3px] text-white">{group.name}</span>
                    <span className="whitespace-nowrap text-cardtitle font-bold text-white" data-group-total>
                        {g3 + g2}<span className="ml-[5px] text-meta font-medium">人</span>
                    </span>
                </div>
                <div className="mt-[8px] text-meta tracking-[1px] text-white/85">大三 {g3} · 大二 {g2}</div>
            </header>
            <div className="tech-card-body" style={{ gridTemplateRows: `repeat(${group.subs.length}, minmax(0, 1fr))` }}>
                {group.subs.map(sub => <SubBlock key={sub.name} sub={sub} group={group} boxWidth={boxWidth} />)}
            </div>
        </section>
    );
}

export function TechRoster({ data, stats }: { data: TechData; stats: TechStats }) {
    return (
        <>
            <PosterHeader
                title="技术组人员名单"
                badge="RM2027"
                subtitle={<>
                    ROBOMASTER 2027 赛季
                    <span className="mx-[9px] text-faint">|</span>
                    {data.groups.map(g => g.name).join(" · ")}
                </>}
                slogan="飒沓流星"
                stats={{ value: String(stats.total), unit: "人", note: `大三 ${stats.g3} · 大二 ${stats.g2}` }}
            />
            <Countdown />
            <main className="relative z-[1] mt-[var(--gap-band)] flex h-[var(--band-h)] items-stretch gap-[var(--gap-card)]">
                {data.groups.map(group => <TechCard key={group.name} group={group} />)}
            </main>
            <PosterFooter />
        </>
    );
}
