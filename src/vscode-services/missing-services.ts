import { Emitter, Event } from 'vs/base/common/event'
import { DomEmitter } from 'vs/base/browser/event'
import { URI } from 'vs/base/common/uri'
import { trackFocus } from 'vs/base/browser/dom'
import { IProgress, IProgressCompositeOptions, IProgressDialogOptions, IProgressNotificationOptions, IProgressOptions, IProgressService, IProgressStep, IProgressWindowOptions } from 'vs/platform/progress/common/progress'
import { ExtUri } from 'vs/base/common/resources'
import { IEditorService } from 'vs/workbench/services/editor/common/editorService'
import { IPaneCompositePartService } from 'vs/workbench/services/panecomposite/browser/panecomposite'
import { IUriIdentityService } from 'vs/platform/uriIdentity/common/uriIdentity'
import { ITextFileEditorModelManager, ITextFileSaveEvent, ITextFileService } from 'vs/workbench/services/textfile/common/textfiles'
import { IFileService } from 'vs/platform/files/common/files'
import { GroupOrientation, IEditorGroup, IEditorGroupsService } from 'vs/workbench/services/editor/common/editorGroupsService'
import { IWorkbenchEnvironmentService } from 'vs/workbench/services/environment/common/environmentService'
import { IWorkingCopyFileService } from 'vs/workbench/services/workingCopy/common/workingCopyFileService'
import { IPathService } from 'vs/workbench/services/path/common/pathService'
import { Schemas } from 'vs/base/common/network'
import { registerSingleton } from 'vs/platform/instantiation/common/extensions'
import { IProductService } from 'vs/platform/product/common/productService'
import { ILanguageStatus, ILanguageStatusService } from 'vs/workbench/services/languageStatus/common/languageStatusService'
import { ITextModel } from 'vs/editor/common/model'
import { IDisposable } from 'vs/workbench/workbench.web.main'
import { LanguageFeatureRegistry } from 'vs/editor/common/languageFeatureRegistry'
import { compare } from 'vs/base/common/strings'
import { IHostService } from 'vs/workbench/services/host/browser/host'
import { ILifecycleService, LifecyclePhase, StartupKind } from 'vs/workbench/services/lifecycle/common/lifecycle'
import { ILanguageDetectionService } from 'vs/workbench/services/languageDetection/common/languageDetectionWorkerService'
import { ITextEditorService } from 'vs/workbench/services/textfile/common/textEditorService'
import { IEditorResolverService } from 'vs/workbench/services/editor/common/editorResolverService'
import { IUntitledTextEditorService } from 'vs/workbench/services/untitled/common/untitledTextEditorService'
import { unsupported } from '../tools'
import { Services } from '../services'

registerSingleton(IEditorService, class EditorService implements IEditorService {
  readonly _serviceBrand = undefined

  onDidActiveEditorChange = Event.None
  onDidVisibleEditorsChange = Event.None
  onDidEditorsChange = Event.None
  onDidCloseEditor = Event.None
  activeEditorPane = undefined
  activeEditor = undefined
  activeTextEditorControl = undefined
  activeTextEditorLanguageId = undefined
  visibleEditorPanes = []
  visibleEditors = []
  visibleTextEditorControls = []
  editors = []
  count = 0
  getEditors = () => []
  openEditor = unsupported
  openEditors = unsupported
  replaceEditors = async () => {}
  isOpened = () => false
  isVisible = () => false
  closeEditor = async () => {}
  closeEditors = async () => {}
  findEditors = () => []
  save = async () => false
  saveAll = async () => false
  revert = async () => false
  revertAll = async () => false
})

registerSingleton(IPaneCompositePartService, class PaneCompositePartService implements IPaneCompositePartService {
  readonly _serviceBrand = undefined
  onDidPaneCompositeOpen = Event.None
  onDidPaneCompositeClose = Event.None
  openPaneComposite = unsupported
  getActivePaneComposite = () => undefined
  getPaneComposite = () => undefined
  getPaneComposites = () => []
  getPinnedPaneCompositeIds = () => []
  getVisiblePaneCompositeIds = () => []
  getProgressIndicator = () => undefined
  hideActivePaneComposite = () => {}
  getLastActivePaneCompositeId = unsupported
  showActivity = unsupported
})

registerSingleton(IUriIdentityService, class UriIdentityService implements IUriIdentityService {
  readonly _serviceBrand = undefined
  extUri = new ExtUri(() => false)
  asCanonicalUri (uri: URI) {
    return uri
  }
})

const onDidSave = new Emitter<ITextFileSaveEvent>()
class TextFileEditorModelManager implements ITextFileEditorModelManager {
  onDidCreate = Event.None
  onDidResolve = Event.None
  onDidChangeDirty = Event.None
  onDidChangeReadonly = Event.None
  onDidRemove = Event.None
  onDidChangeOrphaned = Event.None
  onDidChangeEncoding = Event.None
  onDidSaveError = Event.None
  onDidSave = onDidSave.event
  onDidRevert = Event.None
  models = []
  saveErrorHandler = {
    onSaveError: unsupported
  }

  get = () => undefined
  resolve = unsupported
  addSaveParticipant = unsupported
  runSaveParticipants = unsupported
  canDispose (): true {
    return true
  }
}
registerSingleton(ITextFileService, class TextFileService implements ITextFileService {
  readonly _serviceBrand = undefined
  files = new TextFileEditorModelManager()
  get untitled () { return unsupported() }
  get encoding () { return unsupported() }
  isDirty = () => false
  save = unsupported
  saveAs = unsupported
  revert = unsupported
  read = unsupported
  readStream = unsupported
  write = unsupported
  create = unsupported
  getEncodedReadable = unsupported
  getDecodedStream = unsupported
  dispose () {
    // ignore
  }
})

registerSingleton(IFileService, class FileService implements IFileService {
  readonly _serviceBrand = undefined
  onDidChangeFileSystemProviderRegistrations = Event.None
  onDidChangeFileSystemProviderCapabilities = Event.None
  onWillActivateFileSystemProvider = Event.None
  registerProvider = unsupported
  getProvider = function () {
    return undefined
  }

  activateProvider = async () => {}
  canHandleResource = async () => false
  hasProvider = () => false
  hasCapability = () => false
  listCapabilities = () => []
  onDidFilesChange = Event.None
  onDidRunOperation = Event.None
  resolve = unsupported
  resolveAll = unsupported
  stat = unsupported
  exists = async () => false
  readFile = unsupported
  readFileStream = unsupported
  writeFile = unsupported
  move = unsupported
  canMove = unsupported
  copy = unsupported
  canCopy = unsupported
  cloneFile = unsupported
  createFile = unsupported
  canCreateFile = unsupported
  createFolder = unsupported
  del = unsupported
  canDelete = unsupported
  onDidWatchError = Event.None
  watch = unsupported
  dispose () {
    // ignore
  }
})

class EmptyEditorGroup implements IEditorGroup {
  onDidModelChange = Event.None
  onWillDispose = Event.None
  onDidActiveEditorChange = Event.None
  onWillCloseEditor = Event.None
  onDidCloseEditor = Event.None
  onWillMoveEditor = Event.None
  onWillOpenEditor = Event.None
  id = 0
  index = 0
  label = 'main'
  ariaLabel = 'main'
  activeEditorPane = undefined
  activeEditor = null
  previewEditor = null
  count = 0
  isEmpty = false
  isLocked = false
  stickyCount = 0
  editors = []
  get scopedContextKeyService () { return unsupported() }
  getEditors = unsupported
  findEditors = unsupported
  getEditorByIndex = unsupported
  getIndexOfEditor = unsupported
  openEditor = unsupported
  openEditors = unsupported
  isPinned = unsupported
  isSticky = unsupported
  isActive = unsupported
  contains = unsupported
  moveEditor = unsupported
  moveEditors = unsupported
  copyEditor = unsupported
  copyEditors = unsupported
  closeEditor = unsupported
  closeEditors = unsupported
  closeAllEditors = unsupported
  replaceEditors = unsupported
  pinEditor = unsupported
  stickEditor = unsupported
  unstickEditor = unsupported
  lock = unsupported
  focus (): void {
    // ignore
  }
}

registerSingleton(IEditorGroupsService, class EditorGroupsService implements IEditorGroupsService {
  readonly _serviceBrand = undefined
  onDidChangeActiveGroup = Event.None
  onDidAddGroup = Event.None
  onDidRemoveGroup = Event.None
  onDidMoveGroup = Event.None
  onDidActivateGroup = Event.None
  onDidLayout = Event.None
  onDidScroll = Event.None
  onDidChangeGroupIndex = Event.None
  onDidChangeGroupLocked = Event.None
  get contentDimension () { return unsupported() }
  activeGroup = new EmptyEditorGroup()
  get sideGroup () { return unsupported() }
  groups = []
  count = 0
  orientation = GroupOrientation.HORIZONTAL
  isReady = false
  whenReady = Promise.resolve()
  whenRestored = Promise.resolve()
  hasRestorableState = false
  getGroups = () => []
  getGroup = () => undefined
  activateGroup = unsupported
  getSize = unsupported
  setSize = unsupported
  arrangeGroups = unsupported
  applyLayout = unsupported
  centerLayout = unsupported
  isLayoutCentered = () => false
  setGroupOrientation = unsupported
  findGroup = () => undefined
  addGroup = unsupported
  removeGroup = unsupported
  moveGroup = unsupported
  mergeGroup = unsupported
  mergeAllGroups = unsupported
  copyGroup = unsupported
  get partOptions () { return unsupported() }
  onDidChangeEditorPartOptions = Event.None
  enforcePartOptions = unsupported
})

registerSingleton(IWorkbenchEnvironmentService, class WorkbenchEnvironmentService implements IWorkbenchEnvironmentService {
  readonly _serviceBrand = undefined
  get logFile () { return unsupported() }
  get extHostLogsPath () { return unsupported() }
  skipReleaseNotes = true
  skipWelcome = true
  disableWorkspaceTrust = true
  get webviewExternalEndpoint () { return unsupported() }
  debugRenderer = false
  get userRoamingDataHome () { return unsupported() }
  get settingsResource () { return unsupported() }
  get keybindingsResource () { return unsupported() }
  get keyboardLayoutResource () { return unsupported() }
  get argvResource () { return unsupported() }
  get snippetsHome () { return unsupported() }
  get untitledWorkspacesHome () { return unsupported() }
  get globalStorageHome () { return unsupported() }
  get workspaceStorageHome () { return unsupported() }
  get localHistoryHome () { return unsupported() }
  get cacheHome () { return unsupported() }
  get userDataSyncHome () { return unsupported() }
  get userDataSyncLogResource () { return unsupported() }
  sync = undefined
  get debugExtensionHost () { return unsupported() }
  isExtensionDevelopment = false
  disableExtensions = false
  logsPath = ''
  verbose = false
  isBuilt = false
  disableTelemetry = false
  get telemetryLogResource () { return unsupported() }
  get serviceMachineIdResource () { return unsupported() }
})

registerSingleton(IWorkingCopyFileService, class WorkingCopyFileService implements IWorkingCopyFileService {
  readonly _serviceBrand = undefined
  onWillRunWorkingCopyFileOperation = Event.None
  onDidFailWorkingCopyFileOperation = Event.None
  onDidRunWorkingCopyFileOperation = Event.None
  addFileOperationParticipant = unsupported
  hasSaveParticipants = false
  addSaveParticipant = unsupported
  runSaveParticipants = unsupported
  create = unsupported
  createFolder = unsupported
  move = unsupported
  copy = unsupported
  delete = unsupported
  registerWorkingCopyProvider = unsupported
  getDirty = unsupported
})

registerSingleton(IPathService, class PathService implements IPathService {
  readonly _serviceBrand = undefined
  get path () { return unsupported() }
  defaultUriScheme = Schemas.file
  async fileURI (path: string) {
    return URI.file(path)
  }

  userHome = unsupported
  hasValidBasename = unsupported
  resolvedUserHome = undefined
})

registerSingleton(IProgressService, class ProgressService implements IProgressService {
  readonly _serviceBrand = undefined
  withProgress<R> (options: IProgressOptions | IProgressDialogOptions | IProgressNotificationOptions | IProgressWindowOptions | IProgressCompositeOptions, task: (progress: IProgress<IProgressStep>) => Promise<R>, onDidCancel?: ((choice?: number | undefined) => void) | undefined): Promise<R> {
    const { window } = Services.get()
    if (window?.withProgress != null) {
      return window.withProgress(options, task, onDidCancel)
    }
    return task({ report: () => { } })
  }
})

registerSingleton(IProductService, class ProductService implements IProductService {
  readonly _serviceBrand = undefined

  version = VSCODE_VERSION
  nameShort = 'Code - OSS Dev'
  nameLong = 'Code - OSS Dev'
  applicationName = 'code-oss'
  dataFolderName = '.vscode-oss'
  urlProtocol = 'code-oss'
  reportIssueUrl = 'https://github.com/microsoft/vscode/issues/new'
  licenseName = 'MIT'
  licenseUrl = 'https://github.com/microsoft/vscode/blob/main/LICENSE.txt'
  serverApplicationName = 'code-server-oss'
})

registerSingleton(ILanguageStatusService, class LanguageStatusServiceImpl implements ILanguageStatusService {
  declare _serviceBrand: undefined

  private readonly _provider = new LanguageFeatureRegistry<ILanguageStatus>()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly onDidChange: Event<any> = this._provider.onDidChange

  addStatus (status: ILanguageStatus): IDisposable {
    return this._provider.register(status.selector, status)
  }

  getLanguageStatus (model: ITextModel): ILanguageStatus[] {
    return this._provider.ordered(model).sort((a, b) => {
      let res = b.severity - a.severity
      if (res === 0) {
        res = compare(a.source, b.source)
      }
      if (res === 0) {
        res = compare(a.id, b.id)
      }
      return res
    })
  }
})

const focusTracker = trackFocus(window)
const onVisibilityChange = new DomEmitter(window.document, 'visibilitychange')

const onDidChangeFocus = Event.latch(Event.any(
  Event.map(focusTracker.onDidFocus, () => document.hasFocus()),
  Event.map(focusTracker.onDidBlur, () => document.hasFocus()),
  Event.map(onVisibilityChange.event, () => document.hasFocus())
))

registerSingleton(IHostService, class HostService implements IHostService {
  _serviceBrand: undefined

  onDidChangeFocus = onDidChangeFocus

  get hasFocus (): boolean {
    return document.hasFocus()
  }

  async hadLastFocus (): Promise<boolean> {
    return true
  }

  async focus (): Promise<void> {
    window.focus()
  }

  openWindow = unsupported

  async toggleFullScreen (): Promise<void> {
    if (document.fullscreenEnabled) {
      await document.body.requestFullscreen()
    } else {
      await document.exitFullscreen()
    }
  }

  restart = unsupported
  reload = unsupported
  close = unsupported
})

registerSingleton(ILifecycleService, class LifecycleService implements ILifecycleService {
  _serviceBrand: undefined
  startupKind = StartupKind.NewWindow
  phase = LifecyclePhase.Ready

  async when (): Promise<void> {
    // ignore
  }

  onBeforeShutdown = Event.None
  onShutdownVeto = Event.None
  onBeforeShutdownError = Event.None
  onWillShutdown = Event.None
  onDidShutdown = Event.None
  shutdown = unsupported
})

registerSingleton(ILanguageDetectionService, class LanguageDetectionService implements ILanguageDetectionService {
  _serviceBrand: undefined
  isEnabledForLanguage (): boolean {
    return false
  }

  async detectLanguage (): Promise<string | undefined> {
    return undefined
  }
})

registerSingleton(ITextEditorService, class TextEditorService implements ITextEditorService {
  _serviceBrand: undefined
  createTextEditor = unsupported
})

registerSingleton(IEditorResolverService, class EditorResolverService implements IEditorResolverService {
  _serviceBrand: undefined
  getAssociationsForResource = unsupported
  updateUserAssociations = unsupported
  onDidChangeEditorRegistrations = Event.None
  registerEditor () {
    // ignore
    return {
      dispose: () => {}
    }
  }

  resolveEditor = unsupported
  getEditors = unsupported
})

registerSingleton(IUntitledTextEditorService, class UntitledTextEditorService implements IUntitledTextEditorService {
  _serviceBrand: undefined
  onDidChangeDirty = Event.None
  onDidChangeEncoding = Event.None
  onDidChangeLabel = Event.None
  onWillDispose = Event.None
  create = unsupported
  get = unsupported
  getValue = unsupported
  resolve = unsupported
})
