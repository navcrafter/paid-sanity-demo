import {draftMode} from 'next/headers'
import {NextResponse, type NextRequest} from 'next/server'

// "Exit preview": turns draft mode off and returns to the published home page.
export async function GET(request: NextRequest) {
  ;(await draftMode()).disable()
  return NextResponse.redirect(new URL('/', request.url))
}
