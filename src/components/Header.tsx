import React from "react"
import { IconLogo } from "components/IconLogo"
import { IconGear } from "components/IconGear"
import { IconSignOut } from "components/IconSignOut"
import { useAuth } from "services/auth"
import { IconRepoForked } from "components/IconRepoForked"

export const Header = () => {
  const { logout } = useAuth()

  return (
    <div className="header">
      <a href="/"><IconLogo /></a>
      <div className="icon-actions">
        <div className="settings">
          <a href="/settings"><IconGear /></a>
        </div>
        <div className="logout">
          <a href="#" onClick={ logout }><IconSignOut /></a>
        </div>
        <div className="fork">
          <a href="https://github.com/ellioseven/kratos-ss-ui-react" target="_blank">
            <IconRepoForked />
            <div>Fork on<br/>GitHub</div>
          </a>
        </div>
      </div>
    </div>
  )
}
