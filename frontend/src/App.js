import PlaceholderCreatePage from "main/pages/Placeholder/PlaceholderCreatePage";
import PlaceholderEditPage from "main/pages/Placeholder/PlaceholderEditPage";


import UCSBDiningCommonsMenuItemIndexPage from "main/pages/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemIndexPage";
import UCSBDiningCommonsMenuItemCreatePage from "main/pages/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemCreatePage";
import UCSBDiningCommonsMenuItemEditPage from "main/pages/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemEditPage";

import ArticlesIndexPage from "main/pages/Articles/ArticlesIndexPage";
import ArticlesCreatePage from "main/pages/Articles/ArticlesCreatePage";
import ArticlesEditPage from "main/pages/Articles/ArticlesEditPage";


import { hasRole, useCurrentUser } from "main/utils/currentUser";

import "bootstrap/dist/css/bootstrap.css";
function App() {
            </>
          )
        }

         {
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/ucsbdiningcommonsmenuitem" element={<UCSBDiningCommonsMenuItemIndexPage />} />

        {
          hasRole(currentUser, "ROLE_USER") && (
            <>
              <Route exact path="/articles" element={<ArticlesIndexPage />} />

            </>
          )
        }
        {
          hasRole(currentUser, "ROLE_ADMIN") && (
            <>

              <Route exact path="/ucsbdiningcommonsmenuitem/edit/:id" element={<UCSBDiningCommonsMenuItemEditPage />} />
              <Route exact path="/ucsbdiningcommonsmenuitem/create" element={<UCSBDiningCommonsMenuItemCreatePage />} />
            </>
          )
        }	

              <Route exact path="/articles/edit/:id" element={<ArticlesEditPage />} />
              <Route exact path="/articles/create" element={<ArticlesCreatePage />} />
            </>
          )
        }

      </Routes>
    </BrowserRouter>
  );
