import React, { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { BiUpload } from 'react-icons/bi';
import { BsClipboard, BsClipboardCheck } from 'react-icons/bs';
import Image from 'next/image';
import { Post } from '@prisma/client';
import { ContentState, convertFromHTML, convertToRaw, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import isEmpty from 'lodash.isempty';
import Dialog from 'rc-dialog';

import FileInput from 'components/FileInput';
import MonacoEditor from 'components/MonacoEditor';
import PostPreview from 'components/PostPreview/PostPreview';
import { Select } from 'components/Select';

//import WysiwygEditor from 'components/WysiwygEditor';
import copyToClipboard from 'helpers/clipboard';
import { getToday } from 'helpers/datetime';
import { sendFile } from 'helpers/files';

import styles from './PostForm.module.scss';

const LANGS = ['sk', 'uk', 'ru', 'en', 'de', 'hu', 'es', 'pl', 'ro', 'fr', 'hr', 'sr', 'bg', 'it'];

type Props = {
  data?: Post;
  onSubmit(data: Post): void;
  onDelete?(data: Post): void;
};

export default function PostForm ({ data, onSubmit, onDelete }: Props) {
  const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm<Post>({ defaultValues: data });
  const [activeTab, setActiveTab] = useState<'html' | 'text' | 'preview'>('html');

  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const onEditorStateChange = (updateState: EditorState) => {
    setEditorState(updateState);
    setValue('content', draftToHtml(convertToRaw(updateState.getCurrentContent())));
  };

  const submitHandler: SubmitHandler<Post> = (data) => {
    onSubmit(data);
  };

  const [allowRender, setAllowRender] = useState(false);
  useEffect(() => {
    setAllowRender(true);
  }, []);

  useEffect(() => {
    if (data) {
      setEditorState(EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(data.content).contentBlocks)));
    }
  }, [data]);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  // uplod medias
  const [openUploadMediaDialog, setOpenUploadMediaDialog] = useState(false);
  const [urlToCopy, setUrlToCopy] = useState('');
  const [isUrlCopied, setIsUrlCopied] = useState(false);

  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit(submitHandler)}>
        <div className={styles.controls}>
          <button type="submit" disabled={!isEmpty(errors)} className={styles.submitBtn}>Uložiť</button>
          {!!data?.id && <button type="button" className="error" onClick={() => void setOpenDeleteDialog(true)}>Vymazať</button>}
        </div>
        <div className={styles.dataSections}>
          <div className={styles.data}>
            <b className={styles.title}>Hlavička</b>
            <div className={styles.fields}>
              <div className={styles.col}>
                <label>
                  <span>Názov článku</span>
                  <input type="text" {...register('name', { required: true })} />
                </label>
                <label>
                  <span>Dátum publikácie</span>
                  <input type="text" {...register('publicationDate', { required: true, value: getToday() })} />
                </label>
                <Controller
                  control={control}
                  name="lang"
                  render={({ field }) => (
                    <label>
                      <span>Jazyk</span>
                      <Select
                        options={LANGS.map((lg) => ({
                          value: lg,
                          text: lg.toUpperCase(),
                        }))}
                        onChange={({ value }) => {
                          field.onChange(value);
                        }}
                        value={field.value}
                      />
                    </label>
                  )}
                />
              </div>
              <div className={styles.col}>
                <Controller
                  control={control}
                  name="titleImgUrl"
                  render={({ field }) => (
                    <label>
                      <span>Obrázok</span>
                      <FileInput accept="image/*" id={'titleImgUrl'} onChange={(e) => void sendFile(e.target.files?.[0]).then((filename) => void field.onChange(filename))}>
                        <a
                          title="Upload"
                          className="button"
                        >
                          <BiUpload size={20} />
                          Náhrať
                        </a>
                      </FileInput>
                      <div className={styles.imgWrapper}>
                        {field.value && <Image layout="fill" src={`/api/files?id=${field.value}`} alt="image" />}
                      </div>
                    </label>
                  )}
                />
              </div>
              <div className={styles.col}>
                <label>
                  <span>Media</span>
                  <a className="button" onClick={() => void setOpenUploadMediaDialog(true)}><BiUpload size={20} />Upload and get url</a>
                </label>
              </div>
            </div>
          </div>
          <div className={styles.data}>
            <b className={styles.title}>SEO data</b>
            <div className={styles.fields}>
              <div className={styles.col}>
                <label>
                  <span>Canonical URL (ak nie je duplicita = Slug URL)</span>
                  <input type="text" {...register('canonicalUrl', { required: true })} />
                </label>
                <label>
                  <span>Slug URL (https://ukon.sk/...)</span>
                  <input type="text" {...register('slugUrl', { required: true })} />
                </label>
                <label>
                  <span>Meta name (Založenie živnosti)</span>
                  <input type="text" {...register('metaName', { required: true })} />
                </label>
              </div>
              <div>
                <label>
                  <span>Meta description (Popis stránky)</span>
                  <input type="text" {...register('metaDescription', { required: true })} />
                </label>
                <label>
                  <span>Meta keywords (živnosť, zivnost)</span>
                  <input type="text" {...register('metaKeywords', { required: true })} />
                </label>
                <label>
                  <span>Meta Hreflang (sk/uk/ru/en/de/hu/es/pl/ro/fr/hr/sr/bg/it)</span>
                  <input type="text" {...register('metaHreflang', { required: true })} />
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.contentTabs}>
          <b>Obsah</b>
          {/*<div className={styles.tabs}>
            <div className={`${styles.tab} ${activeTab === 'text' && styles.active}`} onClick={() => setActiveTab('text')}>Text</div>
            <div className={`${styles.tab} ${activeTab === 'html' && styles.active}`} onClick={() => setActiveTab('html')}>Html</div>
            <div className={`${styles.tab} ${activeTab === 'preview' && styles.active}`} onClick={() => setActiveTab('preview')}>Preview</div>
          </div>*/}
          {allowRender && (
            <div className={styles.content}>
              {/*<div className={`${styles.panel} ${activeTab === 'text' && styles.active}`}>
                <WysiwygEditor
                  toolbar={{
                    options: ['inline', 'fontSize', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji', 'image'],
                  }}
                  editorState={editorState}
                  onEditorStateChange={onEditorStateChange}
                  editorClassName={styles.editor}
                />
              </div>*/}
              <div className={`${styles.panel} ${activeTab === 'html' && styles.active}`}>
                <Controller
                  control={control}
                  name="content"
                  render={({ field }) => (
                    <MonacoEditor
                      height="900px"
                      defaultLanguage="html"
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                        setEditorState(EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(value).contentBlocks)));
                      }}
                      theme="vs-dark"
                    />
                  )}
                />
              </div>
              {/*<div className={`${styles.panel} ${activeTab === 'preview' && styles.active}`}>
                <PostPreview data={watch()} />
              </div>*/}
            </div>
          )}
        </div>
      </form>
      <Dialog
        visible={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
      Zadajte heslo aby vymazať článok
        <input type="text" value={inputValue} onChange={handleInputChange} />
        {inputValue === '2024' && (
          <div style={{ display: 'flex', gap: 20, justifyContent: 'center', padding: 20 }}>
            <button className="error" onClick={() => void onDelete(data)}>Vymazať</button>
            <button onClick={() => setOpenDeleteDialog(false)}>Zrušiť</button>
          </div>
        )}
      </Dialog>
      <Dialog
        visible={openUploadMediaDialog}
        onClose={() => {
          setOpenUploadMediaDialog(false);
          setIsUrlCopied(false);
        }}
      >
        <div className={styles.copyDialogWrapper}>
          <FileInput
            accept="image/*"
            id="ImagesUploading"
            onChange={(e) => void sendFile(e.target.files?.[0]).then((filename) => { setUrlToCopy(`https://ukon.sk/api/files?id=${filename}`); setIsUrlCopied(false); })}
          >
            <a
              title="Upload"
              className="button"
            >
              <BiUpload size={20} />
            Upload
            </a>
          </FileInput>
          {!!urlToCopy && (
            <div className={styles.urlToCopy}>
              {urlToCopy}
              <a
                onClick={() => {
                  copyToClipboard(urlToCopy);
                  setIsUrlCopied(true);
                }}
              >
                {!isUrlCopied ? <BsClipboard size={20} /> : <BsClipboardCheck size={20} />}
              </a>
            </div>
          )}
        </div>
      </Dialog>
    </>
  );
}