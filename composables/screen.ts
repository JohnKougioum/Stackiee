import { breakpointsTailwind } from '@vueuse/core'

export const breakpoints = useBreakpoints(breakpointsTailwind)

export const isTabletOrMobileScreen = breakpoints.smallerOrEqual('md')
export const isMediumOrLargeScreen = breakpoints.between('sm', 'xl')
export const isExtraLargeScreen = breakpoints.smallerOrEqual('xl')
