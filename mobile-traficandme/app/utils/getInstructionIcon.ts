export default function getInstructionIcon (instructionType: string) {
    
    switch (instructionType) {
        case 'TURN_LEFT':
            return require('@assets/images/turn-left.png');
        case 'TURN_RIGHT':
            return require('@assets/images/turn-right.png');
        case 'STRAIGHT':
            return require('@assets/images/straight.png');
        case 'UTURN_LEFT':
        case 'UTURN_RIGHT':
            return require('@assets/images/u-turn.png');
        case 'ROUNDABOUT_LEFT':
        case 'ROUNDABOUT_RIGHT':
            return require('@assets/images/roundabout.png');
        default:
            return require('@assets/images/straight.png');
    }
};
